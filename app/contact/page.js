"use client";
import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import "./page.scss";

const ContactPage = () => {
  return (
    <div className="contact-container container">
      <header className="contact-header">
        <h1 className="header-title">Contacteer San Marino 4</h1>
        <div className="header-divider"></div>
      </header>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-group">
            <div className="info-item">
              <FaPhone className="info-icon" />
              <div className="info-text">
                <h2>Reservaties & Informatie</h2>
                <a href="tel:+32412345678" className="info-link">
                  +32 474 98 40 81
                </a>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-text">
                <h2>E-mail Contact</h2>
                <a href="mailto:info@sanmarino.be" className="info-link">
                  info@sanmarino.be
                </a>
              </div>
            </div>
          </div>

          <div className="address-section">
            <FaMapMarkerAlt className="address-icon" />
            <div className="address-text">
              <h2>Adres</h2>
              <p>Parijsstraat 28</p>
              <p>Zeedijk 116</p>
              <p>8430 Middelkerke</p>
            </div>
          </div>
        </div>

        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12635.632325004444!2d2.9180284175773386!3d51.2058277983657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f2cb5d8760f7%3A0x8e89a90b537e8b53!2sParijsstraat%2022-28%2C%20Zeedijk%20116%20%28Middelkerke%29!5e0!3m2!1snl!2sbe!4v1677864778700!5m2!1snl!2sbe"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;