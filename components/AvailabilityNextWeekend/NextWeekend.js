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
    const dow = cur.getDay();
    const daysUntilFri = (5 - dow + 7) % 7;
    const fri = new Date(cur);
    fri.setDate(cur.getDate() + daysUntilFri);
    const sat = new Date(fri);
    sat.setDate(fri.getDate() + 1);
    const sun = new Date(fri);
    sun.setDate(fri.getDate() + 2);

    if (fri > limit) break;

    const friS = formatDate(fri);
    const satS = formatDate(sat);
    const sunS = formatDate(sun);

    if (!booked.has(friS) && !booked.has(satS) && !booked.has(sunS)) {
      return {
        arrival: friS,
        departure: formatDate(new Date(sun.getTime() + 24 * 60 * 60 * 1000)),
      };
    }

    cur.setDate(fri.getDate() + 1);
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
          <div className="date-value">{nextWeekend.arrival}</div>
        </div>
        <div className="date-item">
          <label>Vertrek</label>
          <div className="date-value">{nextWeekend.departure}</div>
        </div>
      </div>

      <form method="get" action="?" className="cta-row">
        <input type="hidden" name="arrivalDate" value={nextWeekend.arrival} />
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
