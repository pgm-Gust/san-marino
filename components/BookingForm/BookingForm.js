"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaExclamationCircle,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaMoneyBillAlt,
} from "react-icons/fa";

export default function BookingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    arrivalDate: "",
    departureDate: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      postalCode: "",
      location: "",
      country: "België",
    },
    notice: "",
    adults: 2,
    children: 0,
    arrivalTime: "15:00",
    departureTime: "10:00",
    paymentMethod: "Bankoverschrijving",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pricePerNight, setPricePerNight] = useState(200);

  // Bereken aantal nachten en de totaalprijs op basis van de ingevoerde data
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

  // Verander de formuliervelden (ook voor geneste velden, zoals address)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Verwerking van het formulier
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.arrivalDate || !formData.departureDate) {
      setError("Vul aub zowel aankomst- als vertrekdatum in");
      setIsSubmitting(false);
      return;
    }

    if (new Date(formData.departureDate) <= new Date(formData.arrivalDate)) {
      setError("Vertrekdatum moet na aankomstdatum liggen");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
          totalPrice: totalPrice,
          pricePerNight: pricePerNight,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Er ging iets mis bij het boeken");
      }

      router.push("/bedankt");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form container">
      {/* Reserveringsgegevens sectie */}
      <section className="booking-section">
        <div className="section-header">
          <FaCalendarAlt size={20} aria-hidden="true" />
          <h2>Reserveringsdetails</h2>
        </div>

        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="arrivalDate">Aankomstdatum *</label>
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
            <label htmlFor="departureDate">Vertrekdatum *</label>
            <input
              id="departureDate"
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="price-summary">
          <div className="price-item">
            <span>Prijs per nacht</span>
            <output>€{pricePerNight.toLocaleString("nl-NL")}</output>
          </div>
          <div className="price-item">
            <span>Aantal nachten</span>
            <output>{nights}</output>
          </div>
          <div className="price-item total">
            <span>Totaalprijs</span>
            <output>€{totalPrice.toLocaleString("nl-NL")}</output>
          </div>
        </div>
      </section>

      {/* Persoonsgegevens sectie */}
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
              Bijvoorbeeld: 0412345678 of +32412345678
            </span>
          </div>
        </div>
      </section>

      {/* Adresgegevens sectie */}
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

      {/* Gezelschap sectie */}
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

      {/* Tijden sectie */}
      <section className="booking-section">
        <div className="section-header">
          <FaClock size={20} aria-hidden="true" />
          <h2>Tijden</h2>
        </div>

        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="arrivalTime">Aankomsttijd *</label>
            <select
              id="arrivalTime"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
            >
              <option value="">Selecteer aankomsttijd</option>
              {Array.from({ length: 9 }, (_, i) => {
                const hour = i + 15;
                return (
                  <option
                    key={hour}
                    value={`${hour.toString().padStart(2, "0")}:00`}
                  >
                    {hour}:00
                  </option>
                );
              })}
            </select>
            <span className="input-hint">Aankomst mogelijk vanaf 15:00</span>
          </div>

          <div className="input-group">
            <label htmlFor="departureTime">Vertrektijd *</label>
            <select
              id="departureTime"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
            >
              <option value="">Selecteer vertrektijd</option>
              {Array.from({ length: 17 }, (_, i) => {
                const hour = i;
                return (
                  <option
                    key={hour}
                    value={`${hour.toString().padStart(2, "0")}:00`}
                  >
                    {hour}:00
                  </option>
                );
              })}
            </select>
            <span className="input-hint">Vertrek mogelijk tot 16:00</span>
          </div>
        </div>
      </section>

      {/* Extra informatie sectie */}
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
            placeholder="Eventuele extra opmerkingen..."
          />
        </div>
      </section>

      {/* Betaalmethode sectie */}
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
            >
              <option value="Bankoverschrijving">Bankoverschrijving</option>
            </select>
          </div>
        </div>
        <div className="payment-notice">
          <FaExclamationCircle className="icon" />
          <p>
            Na het indienen van de boeking ontvangt nemen wij contact op met
            u voor de betaling.
          </p>
        </div>
      </section>

      {/* Foutmelding en submit-button */}
      {error && (
        <div className="error-message" role="alert">
          <FaExclamationCircle aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? (
          <span className="loading">Bevestigen...</span>
        ) : (
          <>
            Bevestig boeking{" "}
            <span className="price">€{totalPrice.toLocaleString("nl-NL")}</span>
          </>
        )}
      </button>
    </form>
  );
}
