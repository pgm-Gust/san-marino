import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const bookingData = await request.json();

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Missing SMTP configuration on server" },
        { status: 500 }
      );
    }
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

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
      Prijs per nacht: €${bookingData.pricePerNight}
      Totaalprijs: €${bookingData.totalPrice}
      
      Extra informatie:
      ----------------
      ${bookingData.notice || "Geen extra informatie"}
    `;

    // HTML-template voor de klant
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
        <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #1976d2, #26c6da); padding: 32px 24px 20px 24px; text-align: center;">
            <img src="https://www.sanmarino4.be/logo.png" alt="San Marino" style="height: 48px; margin-bottom: 12px;" />
            <h1 style="color: #fff; margin: 0; font-size: 2rem;">Bedankt voor je boeking!</h1>
          </div>
          <div style="padding: 28px 24px 24px 24px;">
            <p style="font-size: 1.1rem; color: #1976d2; margin-bottom: 18px;">
              Beste <b>${bookingData.firstName} ${bookingData.lastName}</b>,<br>
              We hebben je boeking goed ontvangen. Wij nemen zo snel mogelijk contact met u op. Hieronder vind je een overzicht van je reservering:
            </p>
            <table style="width: 100%; font-size: 1rem; margin-bottom: 18px;">
              <tr>
                <td><b>Aankomst</b></td>
                <td>${arrivalDate}</td>
              </tr>
              <tr>
                <td><b>Vertrek</b></td>
                <td>${departureDate}</td>
              </tr>
              <tr>
                <td><b>Aantal nachten</b></td>
                <td>${nights}</td>
              </tr>
              <tr>
                <td><b>Personen</b></td>
                <td>${bookingData.adults} volwassenen${
      bookingData.children > 0 ? ` + ${bookingData.children} kinderen` : ""
    }</td>
              </tr>
            </table>
            <div style="margin-bottom: 18px;">
              <b>Adres:</b><br>
              ${bookingData.address.street}, ${
      bookingData.address.postalCode
    } ${bookingData.address.location}, ${bookingData.address.country}
            </div>
            <div style="margin-bottom: 18px;">
              <b>Prijs:</b><br>
              €${bookingData.pricePerNight} per nacht<br>
              <b>Totaal:</b> <span style="color: #1976d2;">€${
                bookingData.totalPrice
              }</span>
            </div>
            <div style="margin-bottom: 18px;">
              <b>Opmerking:</b><br>
              ${bookingData.notice || "Geen extra informatie"}
            </div>
            <div style="margin: 24px 0 0 0; font-size: 0.95rem; color: #888;">
              Je ontvangt binnenkort meer informatie over de betaling en praktische details.<br>
              <br>
              Met vriendelijke groeten,<br>
              <b>San Marino Team</b>
            </div>
          </div>
        </div>
      </div>
    `;

    // Send email to business (primary recipient, BCC for second address)
    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid API when available (better for hosted platforms that block SMTP)
      try {
        const sgKey = process.env.SENDGRID_API_KEY;
        const fromEmail = process.env.SMTP_FROM_EMAIL || 'no-reply@sanmarino4.be';

        // Business notification (plain text)
        const businessPayload = {
          personalizations: [
            {
              to: [{ email: process.env.BOOKING_EMAIL }],
              bcc: process.env.BOOKING_EMAIL_2 ? [{ email: process.env.BOOKING_EMAIL_2 }] : undefined,
              subject: `Nieuwe boeking - ${bookingData.firstName} ${bookingData.lastName}`,
            },
          ],
          from: { email: fromEmail },
          content: [{ type: 'text/plain', value: emailContent }],
        };

        const businessRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sgKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(businessPayload),
        });

        if (!businessRes.ok) {
          const txt = await businessRes.text();
          throw new Error(`SendGrid business send failed: ${businessRes.status} ${txt}`);
        }

        // Guest confirmation (html + text)
        const guestPayload = {
          personalizations: [{ to: [{ email: bookingData.email }] }],
          from: { email: fromEmail },
          subject: 'Bevestiging van je boeking',
          content: [
            { type: 'text/plain', value: `Beste ${bookingData.firstName} ${bookingData.lastName},\n\n${emailContent}` },
            { type: 'text/html', value: htmlContent },
          ],
        };

        const guestRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sgKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(guestPayload),
        });

        if (!guestRes.ok) {
          const txt = await guestRes.text();
          throw new Error(`SendGrid guest send failed: ${guestRes.status} ${txt}`);
        }

      } catch (err) {
        console.error('SendGrid send error:', err);
        return NextResponse.json(
          { error: 'Er ging iets mis bij het versturen via SendGrid', details: err.message },
          { status: 500 }
        );
      }
    } else {
      // Fallback to SMTP (nodemailer)
      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: process.env.BOOKING_EMAIL,
        bcc: process.env.BOOKING_EMAIL_2 || undefined,
        subject: `Nieuwe boeking - ${bookingData.firstName} ${bookingData.lastName}`,
        text: emailContent,
      });

      // Send confirmation email to the guest
      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: bookingData.email,
        subject: 'Bevestiging van je boeking',
        text: `
        Beste ${bookingData.firstName} ${bookingData.lastName},

        Bedankt voor je boeking! Hier zijn je boekingsgegevens:

        ${emailContent}

        Je ontvangt binnenkort meer informatie over de betaling en praktische details.

        Met vriendelijke groeten,
        Het San Marino team
      `,
        html: htmlContent,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending booking email:", error);
    return NextResponse.json(
      {
        error: "Er ging iets mis bij het versturen van de bevestigingsmail",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
