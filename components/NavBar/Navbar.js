"use client";
import React, { useState } from "react";
import "./navbar.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/logo.png" alt="San Marino 4" />
        </a>

        <button
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={isOpen}
          aria-controls="main-navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul
          id="main-navigation"
          className={`nav-menu ${isOpen ? "active" : ""}`}
        >
          <li className="nav-item">
            <a
              href="/appartement/plein"
              className="nav-link"
              onClick={toggleMenu}
            >
              Appartement
            </a>
          </li>
          <li className="nav-item">
            <a href="/locatie" className="nav-link" onClick={toggleMenu}>
              Locatie
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link" onClick={toggleMenu}>
              Contact
            </a>
          </li>
        </ul>

        <button
          className={`nav-overlay ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Sluit menu"
        />
      </div>
    </nav>
  );
};

export default Navbar;
