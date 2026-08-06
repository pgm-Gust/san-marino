import { supabase } from "@/lib/supabase/client";
import { PLEIN_APARTMENT_ID } from "@/lib/constants";

/**
 * Haal prijzen op voor het plein-appartement voor een bepaalde periode.
 * @param {string} startDate - Startdatum (YYYY-MM-DD)
 * @param {string} endDate - Einddatum (YYYY-MM-DD)
 * @returns {Promise<Array<{date: string, price: number}>>}
 */
export async function fetchPleinPrices(startDate, endDate) {
  const { data, error } = await supabase
    .from("apartment_prices")
    .select("date, price")
    .eq("apartment_id", PLEIN_APARTMENT_ID)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}
