import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY client met de service_role key. Omzeilt RLS volledig.
// Nooit importeren in een "use client"-bestand of iets dat naar de browser gaat.
// Bedoeld voor server-routes die zelf al autorisatie afdwingen (admin-sessiecheck,
// of een reeds gevalideerde interne boekingsflow) vóórdat deze client gebruikt wordt.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase service role environment variables");
}

export const supabaseService = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
