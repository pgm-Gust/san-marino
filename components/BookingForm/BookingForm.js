'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AvailabilityChecker from '@components/AvailabilityChecker/AvailabilityChecker';
import BookingDetailsSection from './BookingDetailsSection';
import PersonalDetailsSection from './PersonalDetailsSection';
import AddressDetailsSection from './AddressDetailsSection';
import GroupSection from './GroupSection';
import TimesSection from './TimesSection';
import ExtraInfoSection from './ExtraInfoSection';
import PaymentSection from './PaymentSection';
import ErrorMessage from './ErrorMessage';
import SubmitButton from './SubmitButton';

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
    paymentMethod: 'Bankoverschrijving',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pricePerNight, setPricePerNight] = useState(200);
  const [isAvailable, setIsAvailable] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Callbacks voor AvailabilityChecker
  const handleDatesChange = useCallback((newDates) => {
    setFormData(prev => ({
      ...prev,
      arrivalDate: newDates.arrivalDate,
      departureDate: newDates.departureDate,
    }));
  }, []);

  const handleAvailabilityChange = useCallback((data) => {
    const available = data?.availableApartments?.length > 0;
    setIsAvailable(available);
    if (available) {
      setPricePerNight(data.availableApartments[0]?.pricePerNight || 200);
    }
  }, []);

  // Bereken het aantal nachten en de totaalprijs
  useEffect(() => {
    const calculateNightsAndPrice = () => {
      if (!formData.arrivalDate || !formData.departureDate) return;

      const arrival = new Date(formData.arrivalDate);
      const departure = new Date(formData.departureDate);
      
      if (departure <= arrival) {
        setNights(0);
        setTotalPrice(0);
        return;
      }

      const diffDays = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
      const newTotal = diffDays * pricePerNight;
      setNights(diffDays);
      setTotalPrice(newTotal);
    };

    calculateNightsAndPrice();
  }, [formData.arrivalDate, formData.departureDate, pricePerNight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value },
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

    if (!isAvailable) {
      setError('Deze periode is niet beschikbaar');
      setIsSubmitting(false);
      return;
    }

    if (!agreed) {
      setError('U dient akkoord te gaan met de algemene voorwaarden');
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
          totalPrice: totalPrice,
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
    <form onSubmit={handleSubmit} className="booking-form container">
      <BookingDetailsSection
        handleDatesChange={handleDatesChange}
        handleAvailabilityChange={handleAvailabilityChange}
        pricePerNight={pricePerNight}
        nights={nights}
        totalPrice={totalPrice}
      />
      <PersonalDetailsSection formData={formData} handleChange={handleChange} />
      <AddressDetailsSection formData={formData} handleChange={handleChange} />
      <GroupSection formData={formData} handleChange={handleChange} />
      <TimesSection formData={formData} handleChange={handleChange} />
      <ExtraInfoSection formData={formData} handleChange={handleChange} />
      <PaymentSection formData={formData} handleChange={handleChange} />
      {error && <ErrorMessage error={error} />}

      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          Ik ga akkoord met de <a href="/algemene-voorwaarden" target="_blank"><span className="terms-link">algemene voorwaarden</span></a>
        </label>
      </div>

      <SubmitButton 
        isSubmitting={isSubmitting} 
        isAvailable={isAvailable} 
        totalPrice={totalPrice} 
        disabled={!agreed || isSubmitting}
      />
    </form>
  );
}
