"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCombinedAvailability } from "@/lib/availability";
import "./NextWeekend.scss";

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

// Leesbare weergave ("za 10 okt") voor in de kaart - de ruwe ISO-datum
// ("2026-10-10") blijft enkel gebruikt voor de boekings-link.
function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("nl-BE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
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

  let cur = new Date(today);
  while (cur <= limit) {
    // Find the next Saturday from current date
    const dow = cur.getDay();
    const daysUntilSat = (6 - dow + 7) % 7;
    const sat = new Date(cur.getTime() + daysUntilSat * 24 * 60 * 60 * 1000);
    const sun = new Date(sat.getTime() + 24 * 60 * 60 * 1000);

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

    // Move to the day after this saturday using timestamp (safe across month boundaries)
    cur = new Date(sat.getTime() + 24 * 60 * 60 * 1000);
  }

  return null;
}

export default function NextWeekend({ className = "" }) {
  const [nextWeekend, setNextWeekend] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchCombinedAvailability()
      .then((data) => {
        if (!mounted) return;
        const nw = findNextFreeWeekend(data.events || []);
        setNextWeekend(nw);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  if (!nextWeekend) return null;

  return (
    <div className={`next-weekend-boxx ${className}`}>
      <div className="title-top">
        <span className="cal-icon-badge">
          <svg
            className="cal-icon"
            width="18"
            height="18"
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
        </span>
        <div>
          <span className="availability-pill">
            <span className="dot" aria-hidden="true" />
            Nog vrij
          </span>
          <h3 className="title">Volgend vrij weekend</h3>
        </div>
      </div>

      <div className="dates stacked">
        <div className="date-item">
          <label>Aankomst</label>
          <div className="date-value">
            {formatDisplayDate(nextWeekend.saturday)}
          </div>
        </div>
        <div className="date-arrow" aria-hidden="true">
          →
        </div>
        <div className="date-item">
          <label>Vertrek</label>
          <div className="date-value">
            {formatDisplayDate(nextWeekend.departure)}
          </div>
        </div>
      </div>

      <div className="cta-row">
        <Link
          href={`/appartement/plein/boeken?arrivalDate=${nextWeekend.saturday}&departureDate=${nextWeekend.departure}`}
          className="next-weekend-cta"
        >
          Boek dit weekend
        </Link>
      </div>
    </div>
  );
}
