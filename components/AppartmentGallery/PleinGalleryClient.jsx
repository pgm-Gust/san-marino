"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ApartmentGallery from "@components/AppartmentGallery/AppartmentGallery";

export default function PleinGalleryClient() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from("apartment_images")
        .select("image_url")
        .eq("apartment_id", 1)
        .order("display_order", { ascending: true });
      if (!error && data) setImages(data.map((img) => img.image_url));
    }
    fetchImages();
  }, []);

  return <ApartmentGallery images={images} />;
}
