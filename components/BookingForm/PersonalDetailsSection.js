import React from 'react';
import { FaUser } from 'react-icons/fa';

export default function PersonalDetailsSection({ formData, handleChange }) {
  return (
    <section className="booking-section">
      <div className="section-header">
        <FaUser size={20} aria-hidden="true" />
        <h2>Persoonsgegevens</h2>
      </div>
      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="firstName">Voornaam *</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="lastName">Achternaam *</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mailadres *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">Telefoonnummer *</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="^(\+32|0)[1-9][0-9]{8}$"
            required
          />
          <span className="input-hint">
            Voorbeeld: 0412345678 of +32412345678
          </span>
        </div>
      </div>
    </section>
  );
}
