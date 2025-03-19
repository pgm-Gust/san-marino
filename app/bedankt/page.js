'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaCheckCircle, 
  FaEnvelope, 
  FaPhone, 
  FaHome, 
  FaArrowRight,
  FaExclamationTriangle
} from 'react-icons/fa';

import "./page.scss"

export default function BedanktPagina() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      setError('Geen boekings-ID gevonden');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Fout bij ophalen gegevens');

        setBooking({
          ...data,
          arrivalDate: new Date(data.arrivalDate).toLocaleDateString('nl-BE'),
          departureDate: new Date(data.departureDate).toLocaleDateString('nl-BE')
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) return (
    <div className="loading">
      <p>Gegevens laden...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <FaExclamationTriangle />
      <h2>Er is een fout opgetreden</h2>
      <p>{error}</p>
      <p>Boekingsnummer: {bookingId}</p>
    </div>
  );

  return (
    <div className="bedankt-page">
      <div className="bedankt-card">
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1>Bedankt voor je boeking!</h1>
          <p>Je boeking #{bookingId} is bevestigd</p>
        </div>

        <div className="booking-details">
          <div className="detail-item">
            <h3>🛎️ Jouw reservering</h3>
            <div className="detail-box">
              <p><strong>{booking.apartment}</strong></p>
              <p>{booking.arrivalDate} - {booking.departureDate}</p>
              <p>{booking.adults} volwassenen {booking.children > 0 && `+ ${booking.children} kinderen`}</p>
            </div>
          </div>

          <div className="detail-item">
            <h3>📬 Wat gebeurt nu?</h3>
            <ul className="next-steps">
              <li>📩 Directe bevestiging per e-mail</li>
              <li>🔐 Veilige betalingslink via Smoobu</li>
              <li>📅 Check-in instructies 3 dagen voor aankomst</li>
            </ul>
          </div>

          <div className="detail-item contact-info">
            <h3>📞 Contact</h3>
            <div className="contact-methods">
              <a href="mailto:info@voorbeeld.com" className="contact-link">
                <FaEnvelope /> info@voorbeeld.com
              </a>
              <a href="tel:+32123456789" className="contact-link">
                <FaPhone /> +32 123 45 67 89
              </a>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link href="/" className="btn primary">
            <FaHome /> Terug naar Home
          </Link>
          <Link href="/apartments" className="btn secondary">
            Andere appartementen <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}