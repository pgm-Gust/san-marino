import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const bookingData = await request.json();

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

    // Send email to both business email addresses
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: `${process.env.BOOKING_EMAIL}, ${process.env.BOOKING_EMAIL_2}`, // Send to both email addresses
      subject: `Nieuwe boeking - ${bookingData.firstName} ${bookingData.lastName}`,
      text: emailContent,
    });

    // Send confirmation email to the guest
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: bookingData.email,
      subject: "Bevestiging van je boeking",
      text: `
        Beste ${bookingData.firstName} ${bookingData.lastName},

        Bedankt voor je boeking! Hier zijn je boekingsgegevens:

        ${emailContent}

        Wij nemen binnen 24 uur contact met je op om de betaling te regelen.

        Met vriendelijke groeten,
        Het San Marino team
      `,
    });

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
