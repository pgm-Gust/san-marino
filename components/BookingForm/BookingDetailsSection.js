import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import AvailabilityChecker from '@components/AvailabilityChecker/AvailabilityChecker';

export default function BookingDetailsSection({
  handleDatesChange,
  handleAvailabilityChange,
  pricePerNight,
  nights,
  totalPrice,
}) {
  return (
    <section className="booking-section">
      <div className="section-header">
        <FaCalendarAlt size={20} aria-hidden="true" />
        <h2>Reserveringsdetails</h2>
      </div>

      <AvailabilityChecker
        onDatesChange={handleDatesChange}
        onAvailabilityChange={handleAvailabilityChange}
      />

      <div className="price-summary">
        <div className="price-item">
          <span>Prijs per nacht</span>
          <output>€{pricePerNight.toLocaleString('nl-NL')}</output>
        </div>
        <div className="price-item">
          <span>Aantal nachten</span>
          <output>{nights}</output>
        </div>
        <div className="price-item total">
          <span>Totaalprijs</span>
          <output>€{totalPrice.toLocaleString('nl-NL')}</output>
        </div>
      </div>
    </section>
  );
}
