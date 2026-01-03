"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { uploadImage, deleteImage } from "@/lib/supabase/storage";
import { FaUpload, FaTimes, FaImage, FaSpinner } from "react-icons/fa";
import "./ImageUploader.scss";

export default function ImageUploader({ apartmentId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  // Gebruik de singleton supabase client

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Validatie
    if (!file.type.startsWith("image/")) {
      setError("Alleen afbeeldingen zijn toegestaan");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setError("Bestand is te groot (max 5MB)");
      return;
    }

    setError("");

    // Preview maken
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview({ url: reader.result, file });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview?.file || !apartmentId) return;

    console.log("apartmentId:", apartmentId);
    console.log("preview.file:", preview?.file);

    setUploading(true);
    setError("");

    try {
      // 1. Upload naar Supabase Storage
      const result = await uploadImage(
        supabase,
        preview.file,
        "apartment-images",
        apartmentId
      );

      console.log("Upload result:", result);

      if (result.error) {
        setError(result.error);
        setUploading(false);
        return;
      }

      // 2. Bepaal de display_order (laatste + 1)
      const { data: existingImages } = await supabase
        .from("apartment_images")
        .select("display_order")
        .eq("apartment_id", apartmentId)
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder = existingImages?.[0]?.display_order + 1 || 0;

      const insertBody = {
        apartment_id: apartmentId,
        image_url: result.url,
        storage_path: result.path,
        display_order: nextOrder,
        alt_text: preview.file.name.split(".")[0],
      };
      console.log("Insert body:", insertBody);

      // 3. Voeg toe aan database
      const { error: dbError } = await supabase
        .from("apartment_images")
        .insert(insertBody);

      if (dbError) throw dbError;

      // Reset en callback
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      setError(err.message || "Upload mislukt");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="image-uploader">
      {error && (
        <div className="error-banner">
          <FaTimes /> {error}
        </div>
      )}

      {!preview ? (
        <div
          className={`upload-zone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <FaImage className="upload-icon" />
          <h3>Sleep een foto hierheen</h3>
          <p>of klik om een bestand te selecteren</p>
          <span className="file-info">JPG, PNG of WEBP • Max 5MB</span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div className="preview-zone">
          <div className="preview-image">
            <img src={preview.url} alt="Preview" />
            <button
              className="remove-button"
              onClick={clearPreview}
              disabled={uploading}
            >
              <FaTimes />
            </button>
          </div>

          <div className="preview-actions">
            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <FaSpinner className="spinner" /> Uploaden...
                </>
              ) : (
                <>
                  <FaUpload /> Foto Uploaden
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
