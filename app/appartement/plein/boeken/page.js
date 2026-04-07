"use client";

import { useState, useEffect } from "react";
import BookingForm from "@components/BookingForm/BookingForm";
import AvailabilityCalendar from "@components/AvailabilityCalendar/AvailabilityCalendar";
import NextWeekend from "@components/AvailabilityNextWeekend/NextWeekend";

import "@styles/content-section.css";
import "./page.scss";

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

// compute the next weekend (Fri-Sun) after today that is fully available
function findNextFreeWeekend(events) {
  // build set of booked dates
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
  // search up to 1 year ahead
  const limit = new Date(today);
  limit.setFullYear(limit.getFullYear() + 1);

  let cur = new Date(today);
  while (cur <= limit) {
    const dow = cur.getDay(); // 0 Sun ... 6 Sat
    // find upcoming Friday via timestamp (safe across month boundaries)
    const daysUntilFri = (5 - dow + 7) % 7;
    const fri = new Date(cur.getTime() + daysUntilFri * 24 * 60 * 60 * 1000);
    const sat = new Date(fri.getTime() + 24 * 60 * 60 * 1000);
    const sun = new Date(fri.getTime() + 2 * 24 * 60 * 60 * 1000);

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

    // advance cur to day after this friday via timestamp (safe across month boundaries)
    cur = new Date(fri.getTime() + 24 * 60 * 60 * 1000);
  }

  return null;
}

export default function BoekenPage() {
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

  return (
    <>
      <div className="content-section">
        <div className="text-content">
          <p className="subheading">Boeken</p>
          <h2>Appartement Boeken</h2>
        </div>
      </div>

      <div className="availability-section">
        <h3>Beschikbaarheid</h3>
        <AvailabilityCalendar />
        <NextWeekend className="under-calendar" />
      </div>

      <BookingForm />
    </>
  );
}
