"use client";

import { useState, useEffect } from "react";
import "./AvailabilityCalendar.scss";
import { fetchPleinPrices } from "@/lib/supabase/plein-prices";

export default function AvailabilityCalendar() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prijzen, setPrijzen] = useState([]);

  useEffect(() => {
    fetchAvailability();
    fetchPrijzenVoorMaand(currentDate);
  }, [currentDate]);

  async function fetchPrijzenVoorMaand(date) {
    setLoading(true);
    setError(null);
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
      const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);
      const prijzenData = await fetchPleinPrices(startDate, endDate);
      setPrijzen(prijzenData);
    } catch (err) {
      setError("Kon prijzen niet ophalen");
    } finally {
      setLoading(false);
    }
  }

  const fetchAvailability = async () => {
    try {
      const response = await fetch("/api/combined-availability");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Zet de events om naar het bestaande formaat
      const mapped = (data.events || []).map((event) => ({
        start: event.start,
        end: event.end,
        available: false,
        source: "iCal",
      }));
      setAvailability(mapped);
      setError(null);
    } catch (err) {
      setError("Er ging iets mis bij het ophalen van de beschikbaarheid");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Return first day index where Monday = 0, Sunday = 6
  const getFirstDayOfMonth = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // JS: 0 = Sun, 1 = Mon ... convert to Monday-first index
    return (d + 6) % 7;
  };

  const getDateBookingInfo = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return { isPast: true };
    }

    const booking = availability.find((booking) => {
      const start = new Date(booking.start);
      const end = new Date(booking.end);
      return date >= start && date < end && !booking.available;
    });

    return booking
      ? { isBooked: true, source: booking.source, summary: booking.summary }
      : { isBooked: false };
  };

  const changeMonth = (offset) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Days from previous month to fill first week
    const prevMonthLastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    for (let i = 0; i < firstDay; i++) {
      const dayNum = prevMonthLastDay - (firstDay - 1) + i;
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        dayNum
      );
      const bookingInfo = getDateBookingInfo(date);

      days.push(
        <div
          key={`prev-${i}`}
          className={`calendar-day other-month ${
            bookingInfo.isBooked ? "booked" : "other"
          }`}
        >
          <span className="day-number">{dayNum}</span>
        </div>
      );
    }

    // Add cells for each day of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const bookingInfo = getDateBookingInfo(date);
      // Zoek prijs voor deze dag
      const dateStr = date.toISOString().slice(0, 10);
      const prijsObj = prijzen.find((p) => p.date === dateStr);
      const prijs = prijsObj ? prijsObj.price : null;

      days.push(
        <div
          key={`cur-${day}`}
          className={`calendar-day ${
            bookingInfo.isPast
              ? "past"
              : bookingInfo.isBooked
              ? `booked ${bookingInfo.source === "Manual" ? "manual-block" : ""}`
              : "available"
          }`}
          title={
            bookingInfo.isBooked && bookingInfo.summary
              ? bookingInfo.summary
              : ""
          }
        >
          <span className="day-number">{day}</span>
          <span className="status">
            {bookingInfo.isPast
              ? "Verlopen"
              : bookingInfo.isBooked
              ? bookingInfo.source === "Manual"
                ? "Geblokkeerd"
                : "Bezet"
              : "Beschikbaar"}
          </span>
          {prijs !== null && !bookingInfo.isBooked && (
            <span
              className="price"
              style={{ display: "block", fontSize: "0.9em", color: "#007bff" }}
            >
              €{prijs}
            </span>
          )}
        </div>
      );
    }

    // Fill remaining cells with next month's days to complete the last week(s)
    let nextDay = 1;
    while (days.length % 7 !== 0) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        nextDay
      );
      const bookingInfo = getDateBookingInfo(date);
      days.push(
        <div
          key={`next-${nextDay}`}
          className={`calendar-day other-month ${
            bookingInfo.isBooked ? "booked" : "other"
          }`}
        >
          <span className="day-number">{nextDay}</span>
        </div>
      );
      nextDay++;
    }

    return days;
  };

  if (loading) return <div className="loading">Beschikbaarheid laden...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <button
          onClick={() => changeMonth(-1)}
          disabled={isCurrentMonth()}
          className={isCurrentMonth() ? "disabled" : ""}
        >
          &lt;
        </button>
        <h2>
          {currentDate.toLocaleDateString("nl-BE", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>

      <div className="calendar-weekdays">
        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">{renderCalendar()}</div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Beschikbaar</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>Bezet (Boeking)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color manual-block"></span>
          <span>Geblokkeerd (Handmatig)</span>
        </div>
      </div>
    </div>
  );
}
