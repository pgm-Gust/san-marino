"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function PleinPriceAdmin() {
  const [prices, setPrices] = useState([]);
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  // Bulk invoer
  const [bulkStart, setBulkStart] = useState("");
  const [bulkEnd, setBulkEnd] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrices();
  }, []);

  async function fetchPrices() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("apartment_prices")
      .select("id, date, price")
      .eq("apartment_id", 1)
      .order("date", { ascending: true });
    if (error) setError(error.message);
    else setPrices(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.from("apartment_prices").upsert(
      {
        apartment_id: 1,
        date,
        price: parseFloat(price),
      },
      { onConflict: ["apartment_id", "date"] }
    );
    if (error) setError(error.message);
    setDate("");
    setPrice("");
    await fetchPrices();
    setLoading(false);
  }

  async function handleDelete(id) {
    setLoading(true);
    setError("");
    const { error } = await supabase
      .from("apartment_prices")
      .delete()
      .eq("id", id);
    if (error) setError(error.message);
    await fetchPrices();
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: 32 }}>Plein prijzen per nacht</h2>

      {/* Bulk invoer */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24, marginBottom: 32 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16, color: "#007bff" }}>Bulk prijs instellen</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!bulkStart || !bulkEnd || !bulkPrice) return;
            setLoading(true);
            setError("");
            // Genereer alle datums tussen bulkStart en bulkEnd
            const start = new Date(bulkStart);
            const end = new Date(bulkEnd);
            const days = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              days.push(new Date(d));
            }
            // Maak array van rows
            const rows = days.map((d) => ({
              apartment_id: 1,
              date: d.toISOString().slice(0, 10),
              price: parseFloat(bulkPrice),
            }));
            const { error } = await supabase.from("apartment_prices").upsert(rows, { onConflict: ["apartment_id", "date"] });
            if (error) setError(error.message);
            setBulkStart("");
            setBulkEnd("");
            setBulkPrice("");
            await fetchPrices();
            setLoading(false);
          }}
          style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="bulkStart" style={{ fontWeight: 500, marginBottom: 4 }}>Startdatum</label>
            <input id="bulkStart" type="date" value={bulkStart} onChange={e => setBulkStart(e.target.value)} required style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="bulkEnd" style={{ fontWeight: 500, marginBottom: 4 }}>Einddatum</label>
            <input id="bulkEnd" type="date" value={bulkEnd} onChange={e => setBulkEnd(e.target.value)} required style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="bulkPrice" style={{ fontWeight: 500, marginBottom: 4 }}>Prijs (€)</label>
            <input id="bulkPrice" type="number" min="0" step="1" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} required style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: "#007bff", color: "#fff", border: "none", borderRadius: 6, padding: "10px 18px", fontWeight: 600, cursor: "pointer" }}>
            {loading ? "Opslaan..." : "Bulk opslaan"}
          </button>
        </form>
      </div>

      {/* Enkelvoudige invoer */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24, marginBottom: 32 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16, color: "#007bff" }}>Prijs voor één dag</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="singleDate" style={{ fontWeight: 500, marginBottom: 4 }}>Datum</label>
            <input id="singleDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="singlePrice" style={{ fontWeight: 500, marginBottom: 4 }}>Prijs (€)</label>
            <input id="singlePrice" type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Prijs (€)" required style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: "#007bff", color: "#fff", border: "none", borderRadius: 6, padding: "10px 18px", fontWeight: 600, cursor: "pointer" }}>
            {loading ? "Opslaan..." : "Opslaan"}
          </button>
        </form>
      </div>
      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16, color: "#007bff" }}>Overzicht prijzen</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1em" }}>
          <thead>
            <tr style={{ background: "#f0f4fa" }}>
              <th style={{ padding: "8px 4px", textAlign: "left" }}>Datum</th>
              <th style={{ padding: "8px 4px", textAlign: "left" }}>Prijs (€)</th>
              <th style={{ padding: "8px 4px" }}></th>
            </tr>
          </thead>
          <tbody>
            {prices.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px 4px" }}>{row.date}</td>
                <td style={{ padding: "8px 4px" }}>{row.price}</td>
                <td style={{ padding: "8px 4px" }}>
                  <button onClick={() => handleDelete(row.id)} disabled={loading} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontWeight: 500, cursor: "pointer" }}>
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
