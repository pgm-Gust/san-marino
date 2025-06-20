import { NextResponse } from "next/server";
import ical from "node-ical";

export async function GET() {
  const googleIcalUrl = process.env.GOOGLE_ICAL_URL;
  const airbnbIcalUrl = process.env.AIRBNB_ICAL_URL;

  async function fetchEvents(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const icsText = await res.text();
    const data = ical.parseICS(icsText);
    return Object.values(data)
      .filter((e) => e.type === "VEVENT" && e.start && e.end)
      .map((e) => ({
        start: e.start,
        end: e.end,
        summary: e.summary || "",
      }));
  }

  try {
    const [googleEvents, airbnbEvents] = await Promise.all([
      fetchEvents(googleIcalUrl),
      fetchEvents(airbnbIcalUrl),
    ]);
    const allEvents = [...googleEvents, ...airbnbEvents];
    allEvents.sort((a, b) => a.start - b.start);
    return NextResponse.json({ events: allEvents });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
