import React from 'react';
import { FaMoneyBillAlt } from 'react-icons/fa';

export default function ExtraInfoSection({ formData, handleChange }) {
  return (
    <section className="booking-section">
      <div className="section-header">
        <FaMoneyBillAlt size={20} aria-hidden="true" />
        <h2>Extra informatie</h2>
      </div>
      <div className="input-group">
        <label htmlFor="notice">Speciale verzoeken</label>
        <textarea
          id="notice"
          name="notice"
          value={formData.notice}
          onChange={handleChange}
          rows="4"
          placeholder="Vermeld hier eventuele extra opmerkingen..."
        />
      </div>
    </section>
  );
}
