"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { deleteImage } from "@/lib/supabase/storage";
import { FaTrash, FaStar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./images.scss";

const PLEIN_ID = 1; // Zet hier het juiste id van het plein appartement

export default function PleinImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data, error } = await supabase
      .from("apartment_images")
      .select("*")
      .eq("apartment_id", PLEIN_ID)
      .order("display_order", { ascending: true });
    if (!error) setImages(data || []);
    setLoading(false);
  };

  const handleDelete = async (image) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) return;
    await deleteImage(supabase, image.storage_path);
    await supabase.from("apartment_images").delete().eq("id", image.id);
    loadImages();
  };

  const setPrimary = async (imageId) => {
    await supabase.from("apartment_images").update({ is_primary: false }).eq("apartment_id", PLEIN_ID);
    await supabase.from("apartment_images").update({ is_primary: true }).eq("id", imageId);
    loadImages();
  };

  const moveImage = async (imageId, direction) => {
    const currentIndex = images.findIndex((img) => img.id === imageId);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const currentImage = images[currentIndex];
    const targetImage = images[targetIndex];
    await supabase.from("apartment_images").update({ display_order: targetImage.display_order }).eq("id", currentImage.id);
    await supabase.from("apartment_images").update({ display_order: currentImage.display_order }).eq("id", targetImage.id);
    loadImages();
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="apartment-images-page">
      <div className="page-header">
        <h1>Plein Appartement Foto's beheren</h1>
      </div>
      <div className="upload-section">
        <h2>Nieuwe Foto Uploaden</h2>
        <ImageUploader apartmentId={PLEIN_ID} onUploadComplete={loadImages} />
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
                  <button onClick={() => moveImage(image.id, "up")} disabled={index === 0} className="btn-icon" title="Omhoog">
                    <FaArrowUp />
                  </button>
                  <button onClick={() => moveImage(image.id, "down")} disabled={index === images.length - 1} className="btn-icon" title="Omlaag">
                    <FaArrowDown />
                  </button>
                  {!image.is_primary && (
                    <button onClick={() => setPrimary(image.id)} className="btn-icon primary" title="Maak hoofdfoto">
                      <FaStar />
                    </button>
                  )}
                  <button onClick={() => handleDelete(image)} className="btn-icon delete" title="Verwijderen">
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
