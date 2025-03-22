"use client";
import React, { useState } from 'react';
import './navbar.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
      <a href="/">
            <img 
              src="/logo.png" 
              alt="San Marino 4 Logo" 
              className="logo-image" 
            />
          </a>

        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a href="/appartement/plein" className="nav-link" onClick={toggleMenu}>
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
      </div>
    </nav>
  );
};

export default Navbar;