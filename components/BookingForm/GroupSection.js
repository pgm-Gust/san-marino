import React from 'react';
import { FaUsers } from 'react-icons/fa';

export default function GroupSection({ formData, handleChange }) {
  return (
    <section className="booking-section">
      <div className="section-header">
        <FaUsers size={20} aria-hidden="true" />
        <h2>Gezelschap</h2>
      </div>
      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="adults">Aantal volwassenen</label>
          <input
            id="adults"
            type="number"
            name="adults"
            min="1"
            value={formData.adults}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="children">Aantal kinderen</label>
          <input
            id="children"
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}
