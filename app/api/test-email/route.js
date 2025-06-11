import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
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

    // Send test email
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.BOOKING_EMAIL,
      subject: "Test Email",
      text: "Dit is een test email om te controleren of de email configuratie werkt.",
    });

    return NextResponse.json({
      success: true,
      message: "Test email verstuurd",
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error: "Er ging iets mis bij het versturen van de test email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
