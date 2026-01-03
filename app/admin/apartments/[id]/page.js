"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import "./apartment.scss";

export default function EditApartmentPage() {
  const params = useParams();
  const router = useRouter();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApartment();
    // eslint-disable-next-line
  }, [params.id]);

  const loadApartment = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("id", params.id)
      .single();
    if (error) setError(error.message);
    setApartment(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setApartment({ ...apartment, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("apartments")
      .update({
        name: apartment.name,
        subtitle: apartment.subtitle,
        price_per_night: apartment.price_per_night,
        max_guests: apartment.max_guests,
        size_m2: apartment.size_m2,
        description: apartment.description,
      })
      .eq("id", params.id);
    if (error) setError(error.message);
    setSaving(false);
    if (!error) router.push("/admin/apartments");
  };

  if (loading) return <div className="loading">Laden...</div>;
  if (!apartment) return <div className="error">Appartement niet gevonden</div>;

  return (
    <div className="edit-apartment-page">
      <div className="page-header">
        <Link href="/admin/apartments" className="back-button">
          <FaArrowLeft /> Terug
        </Link>
        <h1>Appartement Bewerken</h1>
      </div>
      <form className="edit-form" onSubmit={handleSave}>
        <label>
          Naam
          <input
            name="name"
            value={apartment.name || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ondertitel
          <input
            name="subtitle"
            value={apartment.subtitle || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Prijs per nacht (€)
          <input
            name="price_per_night"
            type="number"
            value={apartment.price_per_night || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Max. personen
          <input
            name="max_guests"
            type="number"
            value={apartment.max_guests || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Oppervlakte (m²)
          <input
            name="size_m2"
            type="number"
            value={apartment.size_m2 || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Beschrijving
          <textarea
            name="description"
            value={apartment.description || ""}
            onChange={handleChange}
            rows={6}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn-primary" disabled={saving}>
          <FaSave /> Opslaan
        </button>
      </form>
    </div>
  );
}
