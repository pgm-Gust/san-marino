"use client";

import React from "react";
import { motion } from "framer-motion";
import "./LoadingScreen.scss";

const LoadingScreen = () => {
  return (
    <motion.div
      className="loading-screen"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <img src="/logo.png" alt="Logo" className="loading-logo" />
    </motion.div>
  );
};

export default LoadingScreen;
