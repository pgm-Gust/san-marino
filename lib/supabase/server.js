import { createClient } from "@supabase/supabase-js";

// Anon-only client voor publieke, ongeauthenticeerde server-side reads
// (bv. de dynamische [slug]-appartementpagina). Gebruik lib/supabase/authServer.js
// als je de ingelogde admin-sessie nodig hebt.
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
