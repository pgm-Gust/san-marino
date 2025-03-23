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
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUsers,
  FaEuroSign
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 }
  }
};

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
          arrivalDate: new Date(data.arrivalDate).toLocaleDateString('nl-BE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          departureDate: new Date(data.departureDate).toLocaleDateString('nl-BE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          pricePerNight: data.pricePerNight?.toFixed(2) || 0,
          totalPrice: data.totalPrice?.toFixed(2) || 0,
          nights: Math.ceil(
            (new Date(data.departureDate) - new Date(data.arrivalDate)) / (1000 * 60 * 60 * 24)
          )
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
      <p>Even geduld, we halen je boekingsgegevens op...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <FaExclamationTriangle />
      <h2>Oeps, er is iets misgegaan!</h2>
      <p>{error}</p>
      <p>Boekingsnummer: {bookingId}</p>
      <Link href="/contact" className="btn primary">
        Neem contact met ons op
      </Link>
    </div>
  );

  return (
    <div className="bedankt-page">
      <motion.div 
        className="bedankt-card container"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        <div className="success-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <FaCheckCircle className="success-icon" />
          </motion.div>
          <h1>Bedankt voor je boeking!</h1>
          <p>Je boeking <strong>#{bookingId}</strong> is succesvol ontvangen.</p>
        </div>

        <motion.div 
          className="booking-details"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="detail-item" variants={itemVariants}>
            <h3><FaCalendarAlt /> Reisgegevens</h3>
            <div className="detail-box">
              <p>
                Aankomst: <strong>{booking?.arrivalDate}</strong><br />
                Vertrek: <strong>{booking?.departureDate} </strong>
              </p>
              <div className="guest-count">
                <FaUsers /> {booking?.adults} volwassenen 
                {booking?.children > 0 && ` + ${booking.children} kinderen`}
              </div>
            </div>
          </motion.div>

          <motion.div className="detail-item" variants={itemVariants}>
            <h3>Contactgegevens</h3>
            <div className="detail-box">
              <p>
                <a href={`mailto:${booking?.guest?.email}`} className="contact-link">
                  <FaEnvelope /> {booking?.guest?.email}
                </a><br />
                {booking?.guest?.phone && (
                  <a href={`tel:${booking?.guest?.phone}`} className="contact-link">
                    <FaPhone /> {booking?.guest?.phone}
                  </a>
                )}
              </p>
            </div>
          </motion.div>

          <motion.div className="detail-item" variants={itemVariants}>
            <h3><FaEuroSign /> Betalingsgegevens</h3>
            <div className="detail-box price-details">
              <div className="price-line">
                <span>{booking?.nights} nachten × €{booking?.pricePerNight}</span>
                <span>€{(booking?.nights * booking?.pricePerNight).toFixed(2)}</span>
              </div>
              <div className="price-total">
                <span>Totaalbedrag:</span>
                <span>€{booking?.totalPrice}</span>
              </div>
              <p className="payment-notice">
                <strong>Belangrijk:</strong> Wij nemen binnen 24 uur contact met je op via e-mail om de betaling te regelen.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="action-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/" className="btn primary">
            <FaHome /> Naar homepage
          </Link>
          <Link href="/apartments" className="btn secondary">
            Meer appartementen <FaArrowRight />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}