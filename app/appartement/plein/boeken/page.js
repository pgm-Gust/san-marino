"use client";

import BookingForm from "@components/BookingForm/BookingForm";
import AvailabilityCalendar from "@components/AvailabilityCalendar/AvailabilityCalendar";
import NextWeekend from "@components/AvailabilityNextWeekend/NextWeekend";

import "@styles/content-section.css";
import "./page.scss";

export default function BoekenPage() {
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
