"use client";
import { useState, useEffect } from "react";
import { getBookingPrices } from "@/lib/supabase/booking-prices";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.scss";

export default function BookingForm() {
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
  const [nightlyPrices, setNightlyPrices] = useState([]); // array met prijs per nacht
  const [bookedRanges, setBookedRanges] = useState([]);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [requiredMinNights, setRequiredMinNights] = useState(2);

  // Constanten voor extra kosten
  const CLEANING_FEE = 80;
  const DEPOSIT = 250;
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  // Bereken aantal nachten en de totaalprijs op basis van de ingevoerde data
  useEffect(() => {
    // Prefill dates from query params if provided (arrivalDate, departureDate)
    try {
      if (searchParams) {
        const a = searchParams.get("arrivalDate");
        const d = searchParams.get("departureDate");
        if (a) {
          const ad = parseLocalDate(a);
          setArrivalDate(ad);
          setFormData((prev) => ({ ...prev, arrivalDate: a }));
        }
        if (d) {
          const dd = parseLocalDate(d);
          setDepartureDate(dd);
          setFormData((prev) => ({ ...prev, departureDate: d }));
        }
      }
    } catch (err) {
      // ignore malformed dates
    }

    async function calculateNightsAndPrice() {
      if (!formData.arrivalDate || !formData.departureDate) return;

      const arrival = parseLocalDate(formData.arrivalDate);
      const departure = parseLocalDate(formData.departureDate);

      if (!arrival || !departure || departure <= arrival) {
        setNights(0);
        setTotalPrice(0);
        setNightlyPrices([]);
        return;
      }

      const diffDays = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));

      // Prijzen ophalen uit Supabase
      try {
        const prices = await getBookingPrices(
          formData.arrivalDate,
          formData.departureDate,
          pricePerNight,
        );
        setNightlyPrices(prices);
        const nightsTotal = prices.reduce((sum, p) => sum + p, 0);
        // Totaal = nachten + eindschoonmaak
        const newTotal = nightsTotal + CLEANING_FEE;
        setTotalPrice(newTotal);
        setNights(diffDays);
        // Toon gemiddelde prijs per nacht
        if (prices.length > 0) {
          setPricePerNight(
            Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
          );
        }
      } catch (e) {
        setNightlyPrices([]);
        const nightsTotal = diffDays * pricePerNight;
        setTotalPrice(nightsTotal + CLEANING_FEE);
        setNights(diffDays);
      }
    }

    calculateNightsAndPrice();
  }, [formData.arrivalDate, formData.departureDate]);

  // Haal bezette periodes op
  useEffect(() => {
    fetch("/api/combined-availability")
      .then((res) => res.json())
      .then((data) => {
        if (data.events) {
          setBookedRanges(
            data.events.map((e) => ({
              // Converteer server timestamps naar lokale kalenderdatums
              start: formatLocalDate(new Date(e.start)),
              end: formatLocalDate(new Date(e.end)),
            })),
          );
        }
      });
  }, []);

  // Minimum nachten komen enkel uit Supabase (plein apartment_id = 1)
  useEffect(() => {
    if (!formData.arrivalDate) {
      setRequiredMinNights(2);
      return;
    }

    let mounted = true;

    fetch(
      `/api/minimum-nights?arrivalDate=${formData.arrivalDate}&apartmentId=1`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const minNights = data?.minNight?.min_nights;
        setRequiredMinNights(
          Number.isInteger(minNights) && minNights > 0 ? minNights : 2,
        );
      })
      .catch(() => {
        if (mounted) setRequiredMinNights(2);
      });

    return () => {
      mounted = false;
    };
  }, [formData.arrivalDate]);

  // Helper: array van alle bezette dagen
  const bookedDates = bookedRanges.flatMap((range) => {
    const dates = [];
    let current = parseLocalDate(range.start);
    const end = parseLocalDate(range.end);
    if (!current || !end) return dates;
    while (current < end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  });

  // Helper: check of een datum bezet is
  function isDateBooked(dateStr) {
    return bookedDates.some((d) => formatLocalDate(d) === dateStr);
  }

  function getDayClassName(date) {
    const dateStr = formatLocalDate(date);
    return isDateBooked(dateStr) ? "booking-day-booked" : "";
  }

  function getDepartureDayClassName(date) {
    const dateStr = formatLocalDate(date);
    const maxDepartureStr = maxDepartureDate
      ? formatLocalDate(maxDepartureDate)
      : null;

    // In vertrek-kalender moet de toegelaten checkout-grens niet rood tonen.
    if (maxDepartureStr && dateStr === maxDepartureStr) {
      return "";
    }

    return isDateBooked(dateStr) ? "booking-day-booked" : "";
  }

  // Helper: check of een heel bereik vrij is (exclusief end)
  function isRangeAvailable(start, end) {
    if (!start || !end) return false;
    let d = parseLocalDate(start);
    const endDate = parseLocalDate(end);
    if (!d || !endDate) return false;
    while (d < endDate) {
      if (isDateBooked(formatLocalDate(d))) return false;
      d.setDate(d.getDate() + 1);
    }
    return true;
  }

  // Helper: bepaal de eerstvolgende bezette dag na een gegeven datum
  function getNextBookedDate(afterDate) {
    const sorted = bookedDates
      .filter((d) => d > afterDate)
      .sort((a, b) => a - b);
    return sorted.length > 0 ? sorted[0] : null;
  }

  // Bepaal de max vertrekdatum: de eerstvolgende bezette dag na aankomst
  // (vertrek op die dag is toegestaan als checkout)
  let maxDepartureDate = null;
  if (arrivalDate) {
    const nextBooked = getNextBookedDate(arrivalDate);
    if (nextBooked) {
      maxDepartureDate = new Date(nextBooked.getTime());
    }
  }

  // Bepaal of er geldige vertrekdatums zijn
  let hasValidDeparture = false;
  if (arrivalDate) {
    const minDep = new Date(arrivalDate);
    minDep.setDate(minDep.getDate() + requiredMinNights);
    if (!maxDepartureDate || minDep <= maxDepartureDate) {
      hasValidDeparture = true;
    }
  }

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

    if (!agreedTerms) {
      setError(
        "Je moet akkoord gaan met de algemene voorwaarden om te kunnen boeken.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.arrivalDate || !formData.departureDate) {
      setError("Vul aub zowel aankomst- als vertrekdatum in");
      setIsSubmitting(false);
      return;
    }

    const arrivalDateObj = parseLocalDate(formData.arrivalDate);
    const departureDateObj = parseLocalDate(formData.departureDate);

    if (!arrivalDateObj || !departureDateObj || departureDateObj <= arrivalDateObj) {
      setError("Vertrekdatum moet na aankomstdatum liggen");
      setIsSubmitting(false);
      return;
    }

    // Minimaal aantal nachten ophalen uit Supabase
    const arrival = arrivalDateObj;
    const departure = departureDateObj;
    const diffDays = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));

    try {
      const minNightsResponse = await fetch(
        `/api/minimum-nights?arrivalDate=${formData.arrivalDate}&apartmentId=1`,
      );
      const minNightsData = await minNightsResponse.json();

      if (minNightsResponse.ok) {
        const minFromSupabase =
          minNightsData?.minNight?.min_nights || requiredMinNights;
        if (diffDays < minFromSupabase) {
          setError(
            `Voor deze aankomstdatum moet je minimaal ${minFromSupabase} ${
              minFromSupabase === 1 ? "nacht" : "nachten"
            } boeken.`,
          );
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      console.error("Fout bij ophalen minimum nachten:", err);
      // Continue met booking als de check faalt
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
            <label>Aankomstdatum *</label>
            <DatePicker
              selected={arrivalDate}
              onChange={(date) => {
                setArrivalDate(date);
                setFormData((prev) => ({
                  ...prev,
                  arrivalDate: date ? formatLocalDate(date) : "",
                }));
              }}
              excludeDates={bookedDates}
              minDate={(() => {
                let d = new Date();
                d.setDate(d.getDate() + 2);
                return d;
              })()}
              filterDate={(date) => {
                // Mag niet vandaag of morgen zijn
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                return date > tomorrow;
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="Kies een aankomstdatum"
              className="date-picker"
              dayClassName={getDayClassName}
              required
            />
            <p className="date-help-text">Aankomst vanaf 16:00.</p>
          </div>
          <div className="input-group">
            <label>Vertrekdatum *</label>
            <DatePicker
              selected={departureDate}
              onChange={(date) => {
                setDepartureDate(date);
                setFormData((prev) => ({
                  ...prev,
                  departureDate: date ? formatLocalDate(date) : "",
                }));
              }}
              minDate={(() => {
                if (!arrivalDate) return new Date();
                const minDep = new Date(arrivalDate);
                minDep.setDate(minDep.getDate() + requiredMinNights);
                return minDep;
              })()}
              maxDate={maxDepartureDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Kies een vertrekdatum"
              className="date-picker"
              dayClassName={getDepartureDayClassName}
              required
              filterDate={(date) => {
                if (!arrivalDate) return true;
                const minDep = new Date(arrivalDate);
                minDep.setDate(minDep.getDate() + requiredMinNights);
                return (
                  date >= minDep &&
                  (!maxDepartureDate || date <= maxDepartureDate)
                );
              }}
            />
            <p className="date-help-text">Vertrek voor 10:00.</p>
            {arrivalDate && !hasValidDeparture && (
              <div
                style={{ color: "#c62828", marginTop: 6, fontSize: "0.95rem" }}
              >
                Geen enkele geldige vertrekdatum mogelijk na deze aankomst. Kies
                een andere aankomstdatum.
              </div>
            )}
          </div>
        </div>

        <div className="booking-calendar-legend" aria-label="Legenda kalender">
          <span className="legend-item">
            <span className="legend-dot legend-dot-booked" />
            Bezet
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot-available" />
            Beschikbaar
          </span>
        </div>

        <div className="price-summary">
          {nights > 0 && (
            <>
              <div className="price-item">
                <span>
                  Totaal nachten ({nights} {nights === 1 ? "nacht" : "nachten"})
                </span>
                <output>
                  €{(totalPrice - CLEANING_FEE).toLocaleString("nl-NL")}
                </output>
              </div>
              <div className="price-item">
                <span>Eindschoonmaak</span>
                <output>€{CLEANING_FEE.toLocaleString("nl-NL")}</output>
              </div>
              <div className="price-item total">
                <span>Totaal te betalen</span>
                <output>€{totalPrice.toLocaleString("nl-NL")}</output>
              </div>
              <div className="price-item deposit-info">
                <span>Waarborg (niet inbegrepen)</span>
                <output>€{DEPOSIT.toLocaleString("nl-NL")}</output>
              </div>
              <p className="deposit-note">
                * De waarborg van €{DEPOSIT} wordt apart gevraagd en
                teruggestort na vertrek indien er geen schade is.
              </p>
            </>
          )}
          {nights === 0 && (
            <p style={{ textAlign: "center", color: "#666", margin: 0 }}>
              Selecteer aankomst- en vertrekdatum om de prijs te berekenen
            </p>
          )}
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
            Na het indienen van de boeking ontvangt nemen wij contact op met u
            voor de betaling.
          </p>
        </div>
      </section>

      {/* Foutmelding en submit-button */}
      <div className="booking-section terms-section">
        <div className="input-group terms">
          <input
            id="agreeTerms"
            type="checkbox"
            name="agreeTerms"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
          />
          <label htmlFor="agreeTerms">
            Ik ga akkoord met de{" "}
            <a
              href="/algemene-voorwaarden"
              target="_blank"
              rel="noopener noreferrer"
            >
              algemene voorwaarden
            </a>
          </label>
        </div>
      </div>
      {error && (
        <div className="error-message" role="alert">
          <FaExclamationCircle aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !agreedTerms}
        className="submit-buttonnn"
      >
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
