import React from 'react';
import { FaClock } from 'react-icons/fa';

export default function TimesSection({ formData, handleChange }) {
  const arrivalTimes = Array.from({ length: 9 }, (_, i) => `${16 + i}:00`);
  const departureTimes = Array.from({ length: 16 }, (_, i) => `${i + 1}:00`);

  return (
    <section className="booking-section">
      <div className="section-header">
        <FaClock size={20} aria-hidden="true" />
        <h2>Tijden</h2>
      </div>
      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="arrivalTime">Aankomsttijd</label>
          <select
            id="arrivalTime"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
          >
            <option value="">Selecteer aankomsttijd</option>
            {arrivalTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="departureTime">Vertrektijd</label>
          <select
            id="departureTime"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
          >
            <option value="">Selecteer vertrektijd</option>
            {departureTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
