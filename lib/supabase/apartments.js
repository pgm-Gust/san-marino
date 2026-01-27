import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Haal alle appartementen op
 */
export async function fetchApartments() {
  try {
    const { data, error } = await supabase
      .from("apartments")
      .select("id, name, active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching apartments:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchApartments:", error);
    throw error;
  }
}

/**
 * Haal een specifiek appartement op via slug
 * @param {string} slug - De slug van het appartement (bijv. 'plein', 'hoek')
 */
export async function fetchApartmentBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching apartment:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchApartmentBySlug:", error);
    throw error;
  }
}

/**
 * Haal een specifiek appartement op via ID
 * @param {string} id - UUID van het appartement
 */
export async function fetchApartmentById(id) {
  try {
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching apartment:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchApartmentById:", error);
    throw error;
  }
}
