"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { FaEdit, FaImage, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import "./apartments.scss";

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  // Gebruik de singleton supabase client

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      const { data, error } = await supabase
        .from("apartments")
        .select(
          `
          *,
          apartment_images (
            id,
            image_url,
            is_primary
          )
        `
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      setApartments(data || []);
    } catch (error) {
      console.error("Error loading apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from("apartments")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      loadApartments();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  if (loading) {
    return (
      <div className="apartments-admin">
        <div className="loading">Laden...</div>
      </div>
    );
  }

  return (
    <div className="apartments-admin">
      <div className="page-header">
        <div>
          <h1>Appartementen Beheren</h1>
          <p>Bewerk info, prijzen en voorzieningen</p>
        </div>
        <Link href="/admin/apartments/new" className="btn-primary">
          <FaPlus /> Nieuw Appartement
        </Link>
      </div>

      <div className="apartments-grid">
        {apartments.map((apt) => {
          const primaryImage = apt.apartment_images?.find(
            (img) => img.is_primary
          );
          const imageUrl =
            primaryImage?.image_url || apt.apartment_images?.[0]?.image_url;

          return (
            <div key={apt.id} className="apartment-card">
              <div className="card-image">
                {imageUrl ? (
                  <img src={imageUrl} alt={apt.name} />
                ) : (
                  <div className="no-image">
                    <FaImage />
                  </div>
                )}
                <div
                  className={`status-badge ${
                    apt.active ? "active" : "inactive"
                  }`}
                >
                  {apt.active ? "Actief" : "Inactief"}
                </div>
              </div>

              <div className="card-content">
                <h3>{apt.name}</h3>
                <p className="subtitle">{apt.subtitle}</p>

                <div className="card-meta">
                  <span>€{apt.price_per_night}/nacht</span>
                  <span>{apt.max_guests} personen</span>
                  <span>{apt.size_m2}m²</span>
                </div>

                <div className="card-actions">
                  <Link
                    href={`/admin/apartments/${apt.id}`}
                    className="btn-secondary"
                  >
                    <FaEdit /> Bewerken
                  </Link>
                  <Link
                    href={`/admin/apartments/${apt.id}/images`}
                    className="btn-secondary"
                  >
                    <FaImage /> Foto's ({apt.apartment_images?.length || 0})
                  </Link>
                  <button
                    onClick={() => toggleActive(apt.id, apt.active)}
                    className="btn-icon"
                    title={apt.active ? "Deactiveren" : "Activeren"}
                  >
                    {apt.active ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {apartments.length === 0 && (
        <div className="empty-state">
          <FaImage className="empty-icon" />
          <h3>Nog geen appartementen</h3>
          <p>Voeg je eerste appartement toe om te beginnen</p>
          <Link href="/admin/apartments/new" className="btn-primary">
            <FaPlus /> Eerste Appartement Toevoegen
          </Link>
        </div>
      )}
    </div>
  );
}
