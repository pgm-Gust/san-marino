import { NextResponse } from "next/server";
import ical from "node-ical";

export async function GET() {
  try {
    // Fetch Airbnb iCal feed with proper headers
    const response = await fetch(
      "https://www.airbnb.be/calendar/ical/1371025698867822087.ics?s=6c2c597f16d2e24e0670ced6f9674e34",
      {
        headers: {
          Accept: "text/calendar",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Airbnb calendar: ${response.status}`);
    }

    const icalData = await response.text();

    // Parse the iCal data
    const events = await ical.parseICS(icalData);

    // Convert events to a more usable format
    const availability = Object.values(events)
      .map((event) => {
        if (event.type !== "VEVENT") return null;

        // Airbnb uses different summary formats for availability
        const isUnavailable =
          event.summary?.includes("Unavailable") ||
          event.summary?.includes("Not available") ||
          event.summary?.includes("Blocked");

        return {
          start: event.start.toISOString().split("T")[0],
          end: event.end.toISOString().split("T")[0],
          available: !isUnavailable,
          source: "Airbnb",
        };
      })
      .filter(Boolean);

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het ophalen van de beschikbaarheid" },
      { status: 500 }
    );
  }
}
