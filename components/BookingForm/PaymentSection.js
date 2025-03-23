import React from 'react';
import { FaMoneyBillAlt, FaExclamationCircle } from 'react-icons/fa';

export default function PaymentSection({ formData, handleChange }) {
  return (
    <section className="booking-section">
      <div className="section-header">
        <FaMoneyBillAlt size={20} aria-hidden="true" />
        <h2>Betaalmethode</h2>
      </div>
      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="paymentMethod">Betaalmethode *</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            disabled
          >
            <option value="Bankoverschrijving">Bankoverschrijving</option>
          </select>
        </div>
      </div>
      <div className="payment-notice">
        <FaExclamationCircle className="icon" />
        <p>Na het ontvangen van u aanvraag, gaat u een mail ontvangen met alle gegevens. <br></br>Let op, boeking is pas geldigde na dat de aanbetaling van 50% van de verblijfsom is ontvangen.
        </p>
      </div>
    </section>
  );
}
