import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Leest de ingelogde admin-sessie uit cookies binnen een Route Handler / Server Component.
// Retourneert de Supabase user, of null als er geen geldige sessie is.
export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Route handlers hebben hier geen cookie-refresh nodig voor een read-only auth-check.
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
