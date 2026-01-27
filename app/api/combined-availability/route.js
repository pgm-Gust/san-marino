import { NextResponse } from "next/server";
import ical from "node-ical";
import { fetchBlockedDates } from "@/lib/supabase/blocked-dates";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const apartmentId = searchParams.get("apartmentId");
  
  const googleIcalUrl = process.env.GOOGLE_ICAL_URL;
  const airbnbIcalUrl = process.env.AIRBNB_ICAL_URL;

  async function fetchEvents(url) {
    if (!url) return [];
    try {
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
          source: "iCal",
        }));
    } catch (error) {
      console.error(`Error fetching iCal from ${url}:`, error);
      return [];
    }
  }

  try {
    // Haal zowel externe events als handmatig geblokkeerde datums op
    const [googleEvents, airbnbEvents, blockedDates] = await Promise.all([
      fetchEvents(googleIcalUrl),
      fetchEvents(airbnbIcalUrl),
      fetchBlockedDates(apartmentId),
    ]);

    // Converteer geblokkeerde datums naar event formaat
    const blockedEvents = blockedDates.map((blocked) => ({
      start: new Date(blocked.start_date + "T00:00:00"),
      end: new Date(blocked.end_date + "T23:59:59"),
      summary: blocked.reason || "Geblokkeerd",
      source: "Manual",
      id: blocked.id,
    }));

    // Combineer alle events
    const allEvents = [...googleEvents, ...airbnbEvents, ...blockedEvents];
    allEvents.sort((a, b) => a.start - b.start);
    
    return NextResponse.json({ events: allEvents });
  } catch (error) {
    console.error("Error in combined-availability:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
