import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function AddressDetailsSection({ formData, handleChange }) {
  return (
    <section className="booking-section">
      <div className="section-header">
        <FaMapMarkerAlt size={20} aria-hidden="true" />
        <h2>Adresgegevens</h2>
      </div>
      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="street">Straat + huisnummer *</label>
          <input
            id="street"
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="postalCode">Postcode *</label>
          <input
            id="postalCode"
            type="text"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChange={handleChange}
            required
          />
          <span className="input-hint">Voorbeeld: 1234AB</span>
        </div>

        <div className="input-group">
          <label htmlFor="location">Plaats *</label>
          <input
            id="location"
            type="text"
            name="address.location"
            value={formData.address.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="country">Land *</label>
          <select
            id="country"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            required
          >
            <option value="België">België</option>
            <option value="Nederland">Nederland</option>
            <option value="Duitsland">Duitsland</option>
            <option value="Overig">Ander land</option>
          </select>
        </div>
      </div>
    </section>
  );
}
