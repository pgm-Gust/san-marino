"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { deleteImage } from "@/lib/supabase/storage";
import {
  FaTrash,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";
import "./images.scss";

export default function ApartmentImagesPage() {
  const params = useParams();
  const router = useRouter();
  const [apartment, setApartment] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  // Gebruik de singleton supabase client

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      // Laad appartement
      const { data: aptData, error: aptError } = await supabase
        .from("apartments")
        .select("id, name")
        .eq("id", params.id)
        .single();

      if (aptError) throw aptError;
      setApartment(aptData);

      // Laad afbeeldingen
      await loadImages();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    const { data, error } = await supabase
      .from("apartment_images")
      .select("*")
      .eq("apartment_id", params.id)
      .order("display_order", { ascending: true });

    if (!error) {
      setImages(data || []);
    }
  };

  const handleDelete = async (image) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) return;

    try {
      // Verwijder van storage
      await deleteImage(supabase, image.storage_path);

      // Verwijder uit database
      const { error } = await supabase
        .from("apartment_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      loadImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Fout bij verwijderen: " + error.message);
    }
  };

  const setPrimary = async (imageId) => {
    try {
      // Reset alle andere
      await supabase
        .from("apartment_images")
        .update({ is_primary: false })
        .eq("apartment_id", params.id);

      // Zet deze als primary
      const { error } = await supabase
        .from("apartment_images")
        .update({ is_primary: true })
        .eq("id", imageId);

      if (error) throw error;
      loadImages();
    } catch (error) {
      console.error("Error setting primary:", error);
    }
  };

  const moveImage = async (imageId, direction) => {
    const currentIndex = images.findIndex((img) => img.id === imageId);
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    try {
      const currentImage = images[currentIndex];
      const targetImage = images[targetIndex];

      // Wissel de display_order waarden
      await supabase
        .from("apartment_images")
        .update({ display_order: targetImage.display_order })
        .eq("id", currentImage.id);

      await supabase
        .from("apartment_images")
        .update({ display_order: currentImage.display_order })
        .eq("id", targetImage.id);

      loadImages();
    } catch (error) {
      console.error("Error moving image:", error);
    }
  };

  if (loading) {
    return <div className="loading">Laden...</div>;
  }

  return (
    <div className="apartment-images-page">
      <div className="page-header">
        <Link href="/admin/apartments" className="back-button">
          <FaArrowLeft /> Terug
        </Link>
        <div>
          <h1>Foto's beheren</h1>
          <p>{apartment?.name}</p>
        </div>
      </div>

      <div className="upload-section">
        <h2>Nieuwe Foto Uploaden</h2>
        <ImageUploader apartmentId={params.id} onUploadComplete={loadImages} />
      </div>

      <div className="images-section">
        <h2>Huidige Foto's ({images.length})</h2>

        {images.length === 0 ? (
          <div className="empty-state">
            <p>Nog geen foto's. Upload je eerste foto hierboven!</p>
          </div>
        ) : (
          <div className="images-grid">
            {images.map((image, index) => (
              <div key={image.id} className="image-item">
                <img src={image.image_url} alt={image.alt_text || ""} />

                {image.is_primary && (
                  <div className="primary-badge">
                    <FaStar /> Hoofdfoto
                  </div>
                )}

                <div className="image-actions">
                  <button
                    onClick={() => moveImage(image.id, "up")}
                    disabled={index === 0}
                    className="btn-icon"
                    title="Omhoog"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onClick={() => moveImage(image.id, "down")}
                    disabled={index === images.length - 1}
                    className="btn-icon"
                    title="Omlaag"
                  >
                    <FaArrowDown />
                  </button>
                  {!image.is_primary && (
                    <button
                      onClick={() => setPrimary(image.id)}
                      className="btn-icon primary"
                      title="Maak hoofdfoto"
                    >
                      <FaStar />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(image)}
                    className="btn-icon delete"
                    title="Verwijderen"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="image-info">
                  <small>Volgorde: {image.display_order + 1}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
