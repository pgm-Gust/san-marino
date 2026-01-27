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
 * Helper functie om queries opnieuw te proberen bij tijdelijke fouten
 */
async function retryQuery(queryFn, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;

      // Alleen retry bij netwerk/timeout fouten
      if (
        error.message?.includes("fetch") ||
        error.message?.includes("timeout")
      ) {
        if (i < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, i) * 1000)
          );
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

/**
 * Haal alle geblokkeerde datums op voor een appartement
 * @param {string} apartmentId - UUID van het appartement (of null voor alle)
 * @param {string} startDate - Begin datum (YYYY-MM-DD)
 * @param {string} endDate - Eind datum (YYYY-MM-DD)
 */
export async function fetchBlockedDates(
  apartmentId = null,
  startDate = null,
  endDate = null
) {
  try {
    let query = supabase
      .from("blocked_dates")
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
      console.error("Error fetching blocked dates:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchBlockedDates:", error);
    throw error;
  }
}

/**
 * Voeg een nieuwe geblokkeerde periode toe
 * @param {string} apartmentId - UUID van het appartement
 * @param {string} startDate - Begin datum (YYYY-MM-DD)
 * @param {string} endDate - Eind datum (YYYY-MM-DD)
 * @param {string} reason - Reden voor blokkering (optioneel)
 */
export async function addBlockedDate(
  apartmentId,
  startDate,
  endDate,
  reason = null
) {
  try {
    const { data, error } = await supabase
      .from("blocked_dates")
      .insert([
        {
          apartment_id: apartmentId,
          start_date: startDate,
          end_date: endDate,
          reason: reason,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding blocked date:", error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Error in addBlockedDate:", error);
    throw error;
  }
}

/**
 * Verwijder een geblokkeerde periode
 * @param {string} blockedDateId - UUID van de geblokkeerde periode
 */
export async function deleteBlockedDate(blockedDateId) {
  try {
    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", blockedDateId);

    if (error) {
      console.error("Error deleting blocked date:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteBlockedDate:", error);
    throw error;
  }
}

/**
 * Update een geblokkeerde periode
 * @param {string} blockedDateId - UUID van de geblokkeerde periode
 * @param {object} updates - Velden om te updaten
 */
export async function updateBlockedDate(blockedDateId, updates) {
  try {
    const { data, error } = await supabase
      .from("blocked_dates")
      .update(updates)
      .eq("id", blockedDateId)
      .select();

    if (error) {
      console.error("Error updating blocked date:", error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Error in updateBlockedDate:", error);
    throw error;
  }
}

/**
 * Check of een datumbereik geblokkeerd is
 * @param {string} apartmentId - UUID van het appartement
 * @param {string} startDate - Begin datum (YYYY-MM-DD)
 * @param {string} endDate - Eind datum (YYYY-MM-DD)
 */
export async function isDateRangeBlocked(apartmentId, startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .eq("apartment_id", apartmentId)
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if (error) {
      console.error("Error checking blocked dates:", error);
      throw error;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error in isDateRangeBlocked:", error);
    throw error;
  }
}
