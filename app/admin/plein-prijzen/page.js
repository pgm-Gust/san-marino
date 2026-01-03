"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function PleinPriceAdmin() {
  const [prices, setPrices] = useState([]);
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
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
    const { error } = await supabase.from("apartment_prices").upsert({
      apartment_id: 1,
      date,
      price: parseFloat(price),
    }, { onConflict: ["apartment_id", "date"] });
    if (error) setError(error.message);
    setDate("");
    setPrice("");
    await fetchPrices();
    setLoading(false);
  }

  async function handleDelete(id) {
    setLoading(true);
    setError("");
    const { error } = await supabase.from("apartment_prices").delete().eq("id", id);
    if (error) setError(error.message);
    await fetchPrices();
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Plein prijzen per nacht</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          step="1"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Prijs (€)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Opslaan..." : "Opslaan"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Prijs (€)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prices.map(row => (
            <tr key={row.id}>
              <td>{row.date}</td>
              <td>{row.price}</td>
              <td>
                <button onClick={() => handleDelete(row.id)} disabled={loading}>
                  Verwijder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
