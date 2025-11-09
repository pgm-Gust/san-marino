import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const key = process.env.SENDGRID_API_KEY;
    const to = process.env.BOOKING_EMAIL;
    const from = process.env.SMTP_FROM_EMAIL || 'no-reply@sanmarino4.be';

    if (!key) return NextResponse.json({ error: 'SENDGRID_API_KEY not set' }, { status: 500 });
    if (!to) return NextResponse.json({ error: 'BOOKING_EMAIL not set' }, { status: 500 });

    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject: 'SendGrid testbericht',
      content: [{ type: 'text/plain', value: 'Dit is een testbericht vanaf de San Marino site via SendGrid.' }],
    };

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: 'SendGrid responded with error', status: res.status, body: txt }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'SendGrid send OK' });
  } catch (err) {
    console.error('test-sendgrid error:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
