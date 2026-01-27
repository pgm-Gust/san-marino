"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./MinimumNights.scss";

export default function MinimumNightsPage() {
  const [minimumNights, setMinimumNights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    apartmentId: "1",
    startDate: "",
    endDate: "",
    minNights: 2,
    reason: "",
  });

  useEffect(() => {
    fetchMinimumNights();
  }, []);

  async function fetchMinimumNights() {
    try {
      setLoading(true);
      const response = await fetch("/api/minimum-nights");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMinimumNights(data.minimumNights || []);
      setError(null);
    } catch (err) {
      setError("Kon minimum nights niet ophalen");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/minimum-nights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setFormData({
        apartmentId: "1",
        startDate: "",
        endDate: "",
        minNights: 2,
        reason: "",
      });
      setShowForm(false);

      await fetchMinimumNights();
    } catch (err) {
      setError(err.message || "Kon regel niet toevoegen");
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Weet je zeker dat je deze regel wilt verwijderen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/minimum-nights?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      await fetchMinimumNights();
    } catch (err) {
      setError(err.message || "Kon regel niet verwijderen");
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

  return (
    <div className="minimum-nights-page">
      <div className="page-header">
        <div>
          <h1>Minimum Nachten</h1>
          <p className="subtitle">Stel minimum verblijfsduur in per periode</p>
        </div>
        <Link href="/admin/dashboard" className="btn-secondary">
          ← Terug naar Dashboard
        </Link>
      </div>

      <div className="action-bar">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuleren" : "+ Nieuwe Regel"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>Nieuwe Minimum Nachten Regel</h2>
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="minNights">Minimum aantal nachten</label>
              <input
                type="number"
                id="minNights"
                value={formData.minNights}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minNights: parseInt(e.target.value),
                  })
                }
                min="1"
                required
              />
              <small className="form-hint">
                Gasten moeten minimaal dit aantal nachten boeken in deze periode
              </small>
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
                placeholder="Bijv. Zomervakantie, Weekendregeling"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Opslaan
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

      <div className="rules-list">
        {loading ? (
          <p>Laden...</p>
        ) : minimumNights.length === 0 ? (
          <p className="empty-state">Geen minimum nachten regels gevonden</p>
        ) : (
          <table className="rules-table">
            <thead>
              <tr>
                <th>Periode</th>
                <th>Min. Nachten</th>
                <th>Reden</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {minimumNights.map((rule) => (
                <tr key={rule.id}>
                  <td>
                    {formatDate(rule.start_date)} - {formatDate(rule.end_date)}
                  </td>
                  <td className="nights-count">
                    {rule.min_nights}{" "}
                    {rule.min_nights === 1 ? "nacht" : "nachten"}
                  </td>
                  <td>{rule.reason || "-"}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(rule.id)}
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

      <div className="info-box">
        <h3>💡 Hoe werkt het?</h3>
        <ul>
          <li>
            Stel per periode in hoeveel nachten minimaal geboekt moeten worden
          </li>
          <li>Bijvoorbeeld: 7 nachten in de zomer, 2 nachten in de winter</li>
          <li>Periodes mogen overlappen - de hoogste waarde heeft voorrang</li>
          <li>Zonder regel is het standaard minimum 1 nacht</li>
        </ul>
      </div>
    </div>
  );
}
