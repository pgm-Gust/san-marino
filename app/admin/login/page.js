"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./login.scss";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  // Gebruik direct de geïmporteerde supabase client

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect naar admin dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setError(error.message || "Login mislukt. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <h1>San Marino 4 Admin</h1>
          <p className="subtitle">Log in om je appartementen te beheren</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@sanmarino4.be"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Wachtwoord</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Inloggen..." : "Inloggen"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
