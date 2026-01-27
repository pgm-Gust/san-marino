"use client";

import { useState, useEffect } from "react";
import "./BlockedDates.scss";

export default function BlockedDatesPage() {
  const [blockedDates, setBlockedDates] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    apartmentId: "1", // Standaard altijd ID 1
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    await Promise.all([fetchBlockedDates(), fetchApartments()]);
  }

  async function fetchApartments() {
    try {
      // Fallback: gebruik direct een standaard appartement
      const defaultApartment = { id: 1, name: "San Marino 4", slug: "plein" };
      setApartments([defaultApartment]);
      setFormData((prev) => ({
        ...prev,
        apartmentId: "1",
      }));

      // Probeer alsnog de API
      const response = await fetch("/api/apartments");
      if (response.ok) {
        const data = await response.json();
        if (data.apartments && data.apartments.length > 0) {
          setApartments(data.apartments);
          // Als we al een ID hadden, behoud die
          if (!formData.apartmentId) {
            setFormData((prev) => ({
              ...prev,
              apartmentId: data.apartments[0].id.toString(),
            }));
          }
        }
      }
    } catch (err) {
      console.error("Apartments API error:", err);
      // Blijf bij de fallback
    }
  }

  async function fetchBlockedDates() {
    try {
      setLoading(true);
      const response = await fetch("/api/blocked-dates");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setBlockedDates(data.blockedDates || []);
      setError(null);
    } catch (err) {
      setError("Kon geblokkeerde datums niet ophalen");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/blocked-dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Reset form en verberg
      setFormData({
        apartmentId: "1", // Behoud ID 1
        startDate: "",
        endDate: "",
        reason: "",
      });
      setShowForm(false);

      // Refresh lijst
      await fetchBlockedDates();
    } catch (err) {
      setError(err.message || "Kon datum niet blokkeren");
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Weet je zeker dat je deze blokkering wilt verwijderen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blocked-dates?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      await fetchBlockedDates();
    } catch (err) {
      setError(err.message || "Kon blokkering niet verwijderen");
      console.error(err);
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("nl-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getApartmentName(apartmentId) {
    const apartment = apartments.find((apt) => apt.id === apartmentId);
    return apartment ? apartment.name : apartmentId;
  }

  return (
    <div className="blocked-dates-page">
      <div className="page-header">
        <h1>Geblokkeerde Datums</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuleren" : "+ Nieuwe Blokkering"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="blocking-form">
          <h2>Nieuwe Periode Blokkeren</h2>
          <form onSubmit={handleSubmit}>
            {/* Appartement veld verborgen - gebruikt altijd ID 1 */}
            <input type="hidden" name="apartmentId" value="1" />

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Startdatum</label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Einddatum</label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={formData.startDate}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reden (optioneel)</label>
              <input
                type="text"
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Bijv. Onderhoud, privégebruik, etc."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Blokkeren
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Annuleren
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="blocked-dates-list">
        {loading ? (
          <p>Laden...</p>
        ) : blockedDates.length === 0 ? (
          <p className="empty-state">Geen geblokkeerde datums gevonden</p>
        ) : (
          <table className="dates-table">
            <thead>
              <tr>
                <th>Appartement</th>
                <th>Van</th>
                <th>Tot</th>
                <th>Reden</th>
                <th>Aangemaakt</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {blockedDates.map((blocked) => (
                <tr key={blocked.id}>
                  <td>{getApartmentName(blocked.apartment_id)}</td>
                  <td>{formatDate(blocked.start_date)}</td>
                  <td>{formatDate(blocked.end_date)}</td>
                  <td>{blocked.reason || "-"}</td>
                  <td>{formatDate(blocked.created_at)}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(blocked.id)}
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
