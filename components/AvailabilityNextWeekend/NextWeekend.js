"use client";
import { useState, useEffect } from "react";
import "./NextWeekend.scss";

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function findNextFreeWeekend(events) {
  const booked = new Set();
  (events || []).forEach((ev) => {
    const start = new Date(ev.start);
    const end = new Date(ev.end);
    let cur = new Date(start);
    while (cur < end) {
      booked.add(formatDate(cur));
      cur.setDate(cur.getDate() + 1);
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(today);
  limit.setFullYear(limit.getFullYear() + 1);

  const cur = new Date(today);
  while (cur <= limit) {
    // Find the next Saturday from current date
    const dow = cur.getDay();
    const daysUntilSat = (6 - dow + 7) % 7;
    const sat = new Date(cur);
    sat.setDate(cur.getDate() + daysUntilSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);

    if (sat > limit) break;

    const satS = formatDate(sat);
    const sunS = formatDate(sun);

    // Only accept weekends where both Saturday AND Sunday are free
    if (!booked.has(satS) && !booked.has(sunS)) {
      return {
        saturday: satS,
        sunday: sunS,
        // departure = day after sunday (typical checkout)
        departure: formatDate(new Date(sun.getTime() + 24 * 60 * 60 * 1000)),
      };
    }

    // Move to the next day after this saturday to continue search
    cur.setDate(sat.getDate() + 1);
  }

  return null;
}

export default function NextWeekend({ className = "" }) {
  const [nextWeekend, setNextWeekend] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/combined-availability")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const nw = findNextFreeWeekend(data.events || []);
        setNextWeekend(nw);
      })
      .catch(() => {})
      .finally(() => {});
    return () => (mounted = false);
  }, []);

  if (!nextWeekend) return null;

  return (
    <div className={`next-weekend-boxx ${className}`}>
      <div className="title-top">
        <svg
          className="cal-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M16 3v4M8 3v4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <h3 className="title">Volgend vrij weekend</h3>
      </div>

      <div className="dates stacked">
        <div className="date-item">
          <label>Aankomst</label>
          <div className="date-value">{nextWeekend.saturday}</div>
        </div>
        <div className="date-item">
          <label>Vertrek</label>
          <div className="date-value">{nextWeekend.departure}</div>
        </div>
      </div>

      <form method="get" action="?" className="cta-row">
        <input type="hidden" name="arrivalDate" value={nextWeekend.saturday} />
        <input
          type="hidden"
          name="departureDate"
          value={nextWeekend.departure}
        />
        <button type="submit" className="next-weekend-cta">
          Boek dit weekend
        </button>
      </form>
    </div>
  );
}
