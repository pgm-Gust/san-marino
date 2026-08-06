import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getMinimumNightsForDate } from "@/lib/supabase/minimum-nights";
import {
  hasOverlappingBlockedDates,
  addBlockedDate,
} from "@/lib/supabase/blocked-dates";
import { calculateServerBookingPrice } from "@/lib/supabase/serverPricing";

// Voorkomt dat gast-input (naam, opmerking, adres, ...) als HTML in de
// bevestigingsmail terechtkomt — anders kan een gast markup/scripts
// injecteren in een mail die door de klant zelf geopend wordt.
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const REQUIRED_FIELDS = [
  "arrivalDate",
  "departureDate",
  "firstName",
  "lastName",
  "email",
  "phone",
];

export async function POST(request) {
  try {
    const bookingData = await request.json();
    const apartmentId = bookingData.apartmentId || 1;

    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !bookingData[field]
    );
    if (missingFields.length > 0 || !bookingData.address?.street) {
      return NextResponse.json(
        { error: `Ontbrekende velden: ${missingFields.join(", ") || "address"}` },
        { status: 400 }
      );
    }

    const arrivalCheck = new Date(bookingData.arrivalDate);
    const departureCheck = new Date(bookingData.departureDate);
    if (
      isNaN(arrivalCheck.getTime()) ||
      isNaN(departureCheck.getTime()) ||
      departureCheck <= arrivalCheck
    ) {
      return NextResponse.json(
        { error: "Ongeldige aankomst- of vertrekdatum" },
        { status: 400 }
      );
    }

    const requestedNights = Math.ceil(
      (departureCheck - arrivalCheck) / (1000 * 60 * 60 * 24)
    );

    // Server-side beschikbaarheidscontrole: voorkomt dubbele boekingen als
    // twee gasten tegelijk dezelfde periode aanvragen (client-side checks
    // zijn enkel UX, deze check hier is de daadwerkelijke bewaking).
    const overlapping = await hasOverlappingBlockedDates(
      apartmentId,
      bookingData.arrivalDate,
      bookingData.departureDate
    );
    if (overlapping) {
      return NextResponse.json(
        {
          error:
            "Deze periode is helaas net niet meer beschikbaar. Kies andere data.",
        },
        { status: 409 }
      );
    }

    // Server-side minimum-nachten-controle (client-side check is enkel UX)
    const { min_nights: minNights } = await getMinimumNightsForDate(
      apartmentId,
      bookingData.arrivalDate
    );
    if (requestedNights < minNights) {
      return NextResponse.json(
        {
          error: `Voor deze aankomstdatum moet je minimaal ${minNights} ${
            minNights === 1 ? "nacht" : "nachten"
          } boeken.`,
        },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY configuration on server" },
        { status: 500 }
      );
    }

    // Prijs altijd server-side herberekenen tegen apartment_prices — de
    // client stuurt wel een prijs mee (voor de UI), maar die wordt hier
    // genegeerd zodat een gast de prijs niet kan manipuleren.
    const { pricePerNight, totalPrice } = await calculateServerBookingPrice(
      apartmentId,
      bookingData.arrivalDate,
      bookingData.departureDate
    );

    // Blokkeer de periode meteen server-side, vóór de mails verstuurd worden,
    // zodat een gelijktijdige tweede aanvraag hierop botst i.p.v. ook door te gaan.
    await addBlockedDate(
      apartmentId,
      bookingData.arrivalDate,
      bookingData.departureDate,
      `Boeking - ${bookingData.firstName} ${bookingData.lastName}`
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sanmarino4.be";

    // Format dates
    const arrivalDate = new Date(bookingData.arrivalDate).toLocaleDateString(
      "nl-BE",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    const departureDate = new Date(
      bookingData.departureDate
    ).toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Calculate number of nights
    const nights = Math.ceil(
      (new Date(bookingData.departureDate) -
        new Date(bookingData.arrivalDate)) /
        (1000 * 60 * 60 * 24)
    );

    // Create email content
    const emailContent = `
      Nieuwe boeking ontvangen!

      Reserveringsgegevens:
      ---------------------
      Aankomstdatum: ${arrivalDate}
      Vertrekdatum: ${departureDate}
      Aantal nachten: ${nights}
      Aantal personen: ${bookingData.adults} volwassenen${
      bookingData.children > 0 ? ` + ${bookingData.children} kinderen` : ""
    }
      
      Gastgegevens:
      -------------
      Naam: ${bookingData.firstName} ${bookingData.lastName}
      Email: ${bookingData.email}
      Telefoon: ${bookingData.phone}
      
      Adres:
      ------
      Straat: ${bookingData.address.street}
      Postcode: ${bookingData.address.postalCode}
      Plaats: ${bookingData.address.location}
      Land: ${bookingData.address.country}
      
      Tijden:
      -------
      Aankomsttijd: ${bookingData.arrivalTime}
      Vertrektijd: ${bookingData.departureTime}
      
      Prijsgegevens:
      -------------
      Prijs per nacht: €${pricePerNight}
      Totaalprijs: €${totalPrice}
      
      Extra informatie:
      ----------------
      ${bookingData.notice || "Geen extra informatie"}
    `;

    // HTML-template voor de klant
    const htmlContent = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1565c0,#0288d1);padding:40px 32px;text-align:center;">
            <img src="https://www.sanmarino4.be/logo.png" alt="San Marino 4" style="height:56px;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;" />
            <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Bedankt voor je reservering!</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">We kijken ernaar uit u te verwelkomen</p>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:32px 32px 0;">
            <p style="margin:0;font-size:16px;color:#37474f;line-height:1.6;">
              Beste <strong style="color:#1565c0;">${escapeHtml(bookingData.firstName)} ${escapeHtml(
      bookingData.lastName
    )}</strong>,
            </p>
            <p style="margin:12px 0 0;font-size:15px;color:#546e7a;line-height:1.7;">
              We hebben uw boeking goed ontvangen en nemen zo snel mogelijk contact met u op. Hieronder vindt u een overzicht van uw reservering.
            </p>
          </td>
        </tr>

        <!-- Verblijfsgegevens -->
        <tr>
          <td style="padding:24px 32px 0;">
            <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#90a4ae;text-transform:uppercase;letter-spacing:1px;">Verblijfsgegevens</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e3eaf0;">
              <tr style="background:#f8fafc;">
                <td style="padding:14px 18px;font-size:14px;color:#546e7a;width:50%;border-bottom:1px solid #e3eaf0;">📅 Aankomst</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a2332;font-weight:600;border-bottom:1px solid #e3eaf0;">${arrivalDate} om ${escapeHtml(
      bookingData.arrivalTime
    )}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#546e7a;border-bottom:1px solid #e3eaf0;">🏠 Vertrek</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a2332;font-weight:600;border-bottom:1px solid #e3eaf0;">${departureDate} om ${escapeHtml(
      bookingData.departureTime
    )}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:14px 18px;font-size:14px;color:#546e7a;border-bottom:1px solid #e3eaf0;">🌙 Aantal nachten</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a2332;font-weight:600;border-bottom:1px solid #e3eaf0;">${nights} nachten</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#546e7a;">👥 Personen</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a2332;font-weight:600;">${escapeHtml(
                  bookingData.adults
                )} volwassenen${
      bookingData.children > 0 ? ` + ${escapeHtml(bookingData.children)} kinderen` : ""
    }</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Prijsoverzicht -->
        <tr>
          <td style="padding:24px 32px 0;">
            <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#90a4ae;text-transform:uppercase;letter-spacing:1px;">Prijsoverzicht</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e3eaf0;">
              <tr style="background:#f8fafc;">
                <td style="padding:14px 18px;font-size:14px;color:#546e7a;border-bottom:1px solid #e3eaf0;">Prijs per nacht</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a2332;font-weight:600;text-align:right;border-bottom:1px solid #e3eaf0;">€${pricePerNight}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#546e7a;border-bottom:1px solid #e3eaf0;">Eindschoonmaak</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a2332;font-weight:600;text-align:right;border-bottom:1px solid #e3eaf0;">€80</td>
              </tr>
              <tr style="background:#e8f4fd;">
                <td style="padding:16px 18px;font-size:15px;color:#1565c0;font-weight:700;">Totaal</td>
                <td style="padding:16px 18px;font-size:18px;color:#1565c0;font-weight:700;text-align:right;">€${totalPrice}</td>
              </tr>
            </table>
            <p style="margin:10px 0 0;font-size:13px;color:#90a4ae;">* Waarborg €250 (apart te betalen, wordt teruggestort na verblijf)</p>
          </td>
        </tr>

        ${
          bookingData.notice
            ? `
        <!-- Opmerking -->
        <tr>
          <td style="padding:24px 32px 0;">
            <h2 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#90a4ae;text-transform:uppercase;letter-spacing:1px;">Opmerking</h2>
            <div style="background:#fff8e1;border-left:4px solid #ffc107;border-radius:6px;padding:14px 16px;font-size:14px;color:#546e7a;line-height:1.6;">
              ${escapeHtml(bookingData.notice)}
            </div>
          </td>
        </tr>`
            : ""
        }

        <!-- Info box -->
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="background:#e8f5e9;border-radius:10px;padding:18px 20px;text-align:center;">
              <p style="margin:0;font-size:14px;color:#2e7d32;line-height:1.7;">
                ✅ U ontvangt binnenkort meer informatie over de <strong>betaling en praktische details</strong>.<br>
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:32px;text-align:center;border-top:1px solid #e3eaf0;margin-top:24px;">
            <p style="margin:0;font-size:14px;color:#90a4ae;">Met vriendelijke groeten,</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1565c0;">San Marino 4</p>
            <p style="margin:4px 0 0;font-size:13px;color:#b0bec5;">Parijsstraat 28, 8430 Middelkerke</p>
            <a href="https://www.sanmarino4.be" style="display:inline-block;margin-top:12px;font-size:13px;color:#0288d1;text-decoration:none;">www.sanmarino4.be</a>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Stuur mail naar eigenaar
    const { error: businessError } = await resend.emails.send({
      from: fromEmail,
      to: [process.env.BOOKING_EMAIL],
      bcc: process.env.BOOKING_EMAIL_2
        ? [process.env.BOOKING_EMAIL_2]
        : undefined,
      subject: `Nieuwe boeking - ${bookingData.firstName} ${bookingData.lastName}`,
      text: emailContent,
    });

    if (businessError) {
      throw new Error(
        `Resend business send failed: ${JSON.stringify(businessError)}`
      );
    }

    // Stuur bevestigingsmail naar gast
    const { error: guestError } = await resend.emails.send({
      from: fromEmail,
      to: [bookingData.email],
      subject: "Bevestiging van je boeking - San Marino 4",
      html: htmlContent,
      text: `Beste ${bookingData.firstName} ${bookingData.lastName},\n\n${emailContent}`,
    });

    if (guestError) {
      throw new Error(
        `Resend guest send failed: ${JSON.stringify(guestError)}`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending booking email:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het versturen van de bevestigingsmail" },
      { status: 500 }
    );
  }
}
