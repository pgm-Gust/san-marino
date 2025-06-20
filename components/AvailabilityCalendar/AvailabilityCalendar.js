"use client";
import { useState, useEffect } from "react";
import "./AvailabilityCalendar.scss";

export default function AvailabilityCalendar() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchAvailability();
  }, []);

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

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
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
      ? { isBooked: true, source: booking.source }
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const bookingInfo = getDateBookingInfo(date);

      days.push(
        <div
          key={day}
          className={`calendar-day ${
            bookingInfo.isPast
              ? "past"
              : bookingInfo.isBooked
              ? "booked"
              : "available"
          }`}
        >
          <span className="day-number">{day}</span>
          <span className="status">
            {bookingInfo.isPast
              ? "Verlopen"
              : bookingInfo.isBooked
              ? "Bezet"
              : "Beschikbaar"}
          </span>
        </div>
      );
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
        {["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"].map((day) => (
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
          <span>Bezet</span>
        </div>
      </div>
    </div>
  );
}
