import React from "react";
import { FaCalendarCheck } from "react-icons/fa";
import SmoobuWidget from "@components/SmoobuWidget/SmoobuWidget";

export default function AvailabilitySection() {
  return (
    <div className="info-section">
      <h2>
        <FaCalendarCheck /> Beschikbaarheid
      </h2>
      <SmoobuWidget aria-label="Beschikbaarheidskalender" />
    </div>
  );
}
