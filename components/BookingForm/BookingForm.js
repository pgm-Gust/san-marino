'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaExclamationCircle, 
  FaCalendarAlt, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaUsers,
  FaClock,
  FaMoneyBillAlt,
} from 'react-icons/fa';

export default function BookingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    arrivalDate: '',
    departureDate: '',
    apartmentId: process.env.NEXT_PUBLIC_SMOOBU_APARTMENT_ID || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      postalCode: '',
      location: '',
      country: 'België',
    },
    notice: '',
    adults: 2,
    children: 0,
    arrivalTime: '15:00',
    departureTime: '10:00',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const nightlyRate = 200;

  useEffect(() => {
    if (formData.arrivalDate && formData.departureDate) {
      const arrival = new Date(formData.arrivalDate);
      const departure = new Date(formData.departureDate);
      const diffTime = Math.abs(departure - arrival);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      setTotalPrice(diffDays * nightlyRate);
    }
  }, [formData.arrivalDate, formData.departureDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (new Date(formData.departureDate) <= new Date(formData.arrivalDate)) {
      setError('Vertrekdatum moet na aankomstdatum liggen');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
          totalPrice: totalPrice
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Er ging iets mis bij het boeken');
      }

      router.push(`/bedankt?bookingId=${data.id}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <section className="booking-section">
        <div className="section-header">
          <FaCalendarAlt size={20} aria-hidden="true" />
          <h2>Reserveringsdetails</h2>
        </div>
        
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="arrivalDate">Aankomstdatum <span className="required">*</span></label>
            <input
              id="arrivalDate"
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="departureDate">Vertrekdatum <span className="required">*</span></label>
            <input
              id="departureDate"
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="price-summary">
            <div className="price-item">
              <span>Aantal nachten</span>
              <output>{nights}</output>
            </div>
            <div className="price-item total">
              <span>Totaalprijs</span>
              <output>€{totalPrice.toLocaleString('nl-NL')}</output>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-section">
        <div className="section-header">
          <FaUser size={20} aria-hidden="true" />
          <h2>Persoonsgegevens</h2>
        </div>

        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="firstName">Voornaam <span className="required">*</span></label>
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
            <label htmlFor="lastName">Achternaam <span className="required">*</span></label>
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
            <label htmlFor="email">E-mailadres <span className="required">*</span></label>
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
            <label htmlFor="phone">Telefoonnummer <span className="required">*</span></label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="^(\+32|0)[1-9][0-9]{8}$"
              required
            />
            <span className="input-hint">Voorbeeld: 0612345678 of +31612345678</span>
          </div>
        </div>
      </section>

      <section className="booking-section">
        <div className="section-header">
          <FaMapMarkerAlt size={20} aria-hidden="true" />
          <h2>Adresgegevens</h2>
        </div>

        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="street">Straat + huisnummer <span className="required">*</span></label>
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
            <label htmlFor="postalCode">Postcode <span className="required">*</span></label>
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
            <label htmlFor="location">Plaats <span className="required">*</span></label>
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
            <label htmlFor="country">Land <span className="required">*</span></label>
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

      <section className="booking-section">
        <div className="section-header">
          <FaClock size={20} aria-hidden="true" />
          <h2>Tijden</h2>
        </div>

        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="arrivalTime">Aankomsttijd</label>
            <input
              id="arrivalTime"
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="departureTime">Vertrektijd</label>
            <input
              id="departureTime"
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

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

      {error && (
        <div className="error-message" role="alert">
          <FaExclamationCircle aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? (
          <span className="loading">Bevestigen...</span>
        ) : (
          <>
            Bevestig boeking
            <span className="price">€{totalPrice.toLocaleString('nl-NL')}</span>
          </>
        )}
      </button>
    </form>
  );
}