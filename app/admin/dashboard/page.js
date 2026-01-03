"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHome, FaImages, FaStar, FaSignOutAlt, FaCog } from "react-icons/fa";
import "./dashboard.scss";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    apartments: 0,
    images: 0,
    reviews: 0,
  });
  const router = useRouter();
  // Gebruik direct de geïmporteerde supabase client

  useEffect(() => {
    checkUser();
    loadStats();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const [apartmentsRes, imagesRes, reviewsRes] = await Promise.all([
        supabase
          .from("apartments")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("apartment_images")
          .select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        apartments: apartmentsRes.count || 0,
        images: imagesRes.count || 0,
        reviews: reviewsRes.count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-header">
          <h1>San Marino 4</h1>
          <p>Admin Dashboard</p>
        </div>

        <div className="nav-user">
          <p>Ingelogd als:</p>
          <strong>{user?.email}</strong>
        </div>

        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Uitloggen
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welkom terug! 👋</h2>
          <p>Beheer hier je appartementen, foto's en reviews.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon apartments">
              <FaHome />
            </div>
            <div className="stat-info">
              <h3>{stats.apartments}</h3>
              <p>Appartementen</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon images">
              <FaImages />
            </div>
            <div className="stat-info">
              <h3>{stats.images}</h3>
              <p>Foto's</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon reviews">
              <FaStar />
            </div>
            <div className="stat-info">
              <h3>{stats.reviews}</h3>
              <p>Reviews</p>
            </div>
          </div>
        </div>

        <div className="action-cards">
          <Link href="/admin/plein-images" className="action-card">
            <FaImages className="card-icon" />
            <h3>Plein Foto's beheren</h3>
            <p>Voeg nieuwe foto's toe of verwijder oude</p>
          </Link>

          <Link href="/admin/plein-prijzen" className="action-card">
            <FaCog className="card-icon" />
            <h3>Plein Prijzen beheren</h3>
            <p>Stel prijzen per nacht in voor het plein appartement</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
