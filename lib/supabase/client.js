import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true, // Automatisch tokens verversen
      persistSession: true, // Sessie behouden in localStorage
      detectSessionInUrl: true, // OAuth callbacks detecteren
    },
    // Global retry logic voor tijdelijke connectie problemen
    global: {
      fetch: async (url, options = {}) => {
        const maxRetries = 3;
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
          try {
            const response = await fetch(url, options);
            return response;
          } catch (error) {
            lastError = error;
            // Wacht exponentieel langer bij elke retry (1s, 2s, 4s)
            if (i < maxRetries - 1) {
              await new Promise((resolve) =>
                setTimeout(resolve, Math.pow(2, i) * 1000)
              );
            }
          }
        }
        throw lastError;
      },
    },
  }
);
