import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

/**
 * Haal minimum nights regels op
 * @param {string} apartmentId - UUID van het appartement
 * @param {string} startDate - Begin datum (YYYY-MM-DD)
 * @param {string} endDate - Eind datum (YYYY-MM-DD)
 */
export async function fetchMinimumNights(
  apartmentId = null,
  startDate = null,
  endDate = null
) {
  try {
    let query = supabase
      .from("minimum_nights")
      .select("*")
      .order("start_date", { ascending: true });

    if (apartmentId) {
      query = query.eq("apartment_id", apartmentId);
    }

    if (startDate) {
      query = query.gte("end_date", startDate);
    }

    if (endDate) {
      query = query.lte("start_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching minimum nights:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchMinimumNights:", error);
    throw error;
  }
}

/**
 * Bepaal het minimum aantal nachten voor een specifieke aankomstdatum
 * @param {string} apartmentId - UUID van het appartement
 * @param {string} arrivalDate - Aankomstdatum (YYYY-MM-DD)
 */
export async function getMinimumNightsForDate(apartmentId, arrivalDate) {
  try {
    const { data, error } = await supabase
      .from("minimum_nights")
      .select("min_nights, reason")
      .eq("apartment_id", apartmentId)
      .lte("start_date", arrivalDate)
      .gte("end_date", arrivalDate)
      .order("min_nights", { ascending: false }) // Hoogste minimum heeft voorrang
      .limit(1);

    if (error) {
      console.error("Error getting minimum nights:", error);
      throw error;
    }

    // Default is 1 nacht als er geen regel is
    return data && data.length > 0 ? data[0] : { min_nights: 1, reason: null };
  } catch (error) {
    console.error("Error in getMinimumNightsForDate:", error);
    return { min_nights: 1, reason: null };
  }
}

/**
 * Voeg een nieuwe minimum nights regel toe
 */
export async function addMinimumNight(
  apartmentId,
  startDate,
  endDate,
  minNights,
  reason = null
) {
  try {
    const { data, error } = await supabase
      .from("minimum_nights")
      .insert([
        {
          apartment_id: apartmentId,
          start_date: startDate,
          end_date: endDate,
          min_nights: minNights,
          reason: reason,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding minimum night:", error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Error in addMinimumNight:", error);
    throw error;
  }
}

/**
 * Verwijder een minimum nights regel
 */
export async function deleteMinimumNight(id) {
  try {
    const { error } = await supabase
      .from("minimum_nights")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting minimum night:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteMinimumNight:", error);
    throw error;
  }
}

/**
 * Update een minimum nights regel
 */
export async function updateMinimumNight(id, updates) {
  try {
    const { data, error } = await supabase
      .from("minimum_nights")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating minimum night:", error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Error in updateMinimumNight:", error);
    throw error;
  }
}
