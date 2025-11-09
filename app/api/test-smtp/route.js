import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return NextResponse.json({ error: 'Missing SMTP configuration on server' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.verify();
    return NextResponse.json({ success: true, message: 'SMTP connection verified' });
  } catch (error) {
    // Provide structured error info to help debugging (don't leak secrets)
    const response = {
      error: 'SMTP verify failed',
      details: error && error.message ? error.message : String(error),
      code: error && error.code ? error.code : undefined,
    };
    console.error('SMTP verify error:', error);
    return NextResponse.json(response, { status: 500 });
  }
}
