import React from "react";
import fs from "fs";
import path from "path";

function readEventsFromFile() {
  try {
    const p = path.resolve(process.cwd(), "data", "events.json");
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read events.json:", err);
    return null;
  }
}

export default function Page() {
  const json = readEventsFromFile();
  if (!json || json.error) {
    return (
      <div>
        <h1>Google Events</h1>
        <p>No events data found. Run the fetch script to populate data.</p>
      </div>
    );
  }

  const calendars = Array.isArray(json.data) ? json.data : [];

  return (
    <div>
      <h1>Google Events</h1>
      <p>Fetched at: {json.fetchedAt || "unknown"}</p>
      {calendars.length === 0 ? (
        <p>No calendars found in `data/events.json`.</p>
      ) : (
        <>
          <p>Total calendars: {calendars.length}</p>
          <ul>
            {calendars.map((cal) => (
              <li key={cal.calendarId || cal.id || Math.random()}>
                {cal.summary || cal.calendarId || "(untitled)"} —{" "}
                {Array.isArray(cal.events) ? cal.events.length : 0} events
              </li>
            ))}
          </ul>

          <h2>Next upcoming events (combined)</h2>
          {(() => {
            const combined = [];
            calendars.forEach((cal) => {
              (Array.isArray(cal.events) ? cal.events : []).forEach((e) => {
                const startRaw =
                  (e.start && (e.start.dateTime || e.start.date)) || null;
                const start = startRaw ? new Date(startRaw) : null;
                combined.push({
                  calendar: cal.summary || cal.calendarId,
                  event: e,
                  start,
                });
              });
            });
            combined.sort((a, b) => {
              if (!a.start && !b.start) return 0;
              if (!a.start) return 1;
              if (!b.start) return -1;
              return a.start - b.start;
            });
            const upcoming = combined.slice(0, 25);
            if (upcoming.length === 0) return <p>No upcoming events found.</p>;
            return (
              <ol>
                {upcoming.map((item, i) => (
                  <li key={i}>
                    <strong>{item.event.summary || "(no title)"}</strong> —{" "}
                    {item.calendar} —{" "}
                    {item.start ? item.start.toLocaleString() : "no start"}
                  </li>
                ))}
              </ol>
            );
          })()}

          {/* Google Calendar embed */}
          <div style={{ marginTop: 24 }}>
            <h2>Calendar embed</h2>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=booking.sanmarino4%40gmail.com&ctz=Europe%2FBrussels"
              style={{ border: 0 }}
              width="800"
              height="600"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </>
      )}
    </div>
  );
}
