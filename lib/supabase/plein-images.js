import { supabase } from "@/lib/supabase/client";
import { PLEIN_APARTMENT_ID } from "@/lib/constants";

export async function getPleinImages() {
  const { data, error } = await supabase
    .from("apartment_images")
    .select("image_url")
    .eq("apartment_id", PLEIN_APARTMENT_ID)
    .order("display_order", { ascending: true });
  if (error) return [];
  return data?.map((img) => img.image_url) || [];
}
