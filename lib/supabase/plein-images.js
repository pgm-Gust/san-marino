import { supabase } from "@/lib/supabase/client";

export async function getPleinImages() {
  const { data, error } = await supabase
    .from("apartment_images")
    .select("image_url")
    .eq("apartment_id", 1)
    .order("display_order", { ascending: true });
  if (error) return [];
  return data?.map((img) => img.image_url) || [];
}
