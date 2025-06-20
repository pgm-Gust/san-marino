"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaArrowRight,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUsers,
  FaEuroSign,
} from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

export default function BedanktPagina() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const searchParams = useSearchParams();
  // const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    // Je kunt hier eventueel nog fetchen als je extra info wilt tonen
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="loading">
        <p>Even geduld, we halen je boekingsgegevens op...</p>
      </div>
    );

  return (
    <div className="bedankt-page">
      <motion.div
        className="bedankt-card container"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <div className="success-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FaCheckCircle className="success-icon" />
          </motion.div>
          <h1>Bedankt voor je boeking!</h1>
          <div className="confetti-overlay">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="mail-confirmation">
          <FaEnvelope className="mail-icon" />
          <span>
            Je ontvangt zo meteen een bevestigingsmail met alle details. (Bekijk zeker ook uw spam-folder)
          </span>
        </div>
        <motion.div
          className="action-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/"
            className="btn primary"
            style={{
              width: "100%",
              justifyContent: "center",
              fontSize: "1.2rem",
              padding: "1.2rem 0",
            }}
          >
            <FaHome /> Naar startpagina
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
