import React from "react";
import {
  FaWifi, FaTv, FaCar, FaDog, FaConciergeBell,
  FaUtensils, FaBed, FaBath, FaCouch, FaSnowflake, FaFireExtinguisher,
  FaClock, FaSmokingBan, FaMapMarkerAlt, FaStar, FaCalendarCheck, FaUmbrellaBeach, FaBinoculars, FaShieldAlt, FaHandsWash,
  FaFirstAid, FaScroll, FaVolumeMute, FaGlassCheers , FaLayerGroup
} from "react-icons/fa";

import "./page.scss";

import ApartmentGallery from "@components/AppartmentGallery/AppartmentGallery";
import SmoobuWidget from "@components/SmoobuWidget/SmoobuWidget";

export default function PleinApartment() {
  return (
    <section className="apartment-overview">
      <p className="subheading">Luxe vakantieverblijf</p>
      <h2>Appartement met zicht op zee en plein</h2>
      <ApartmentGallery />
      <div className="info-section">
        <h3><FaConciergeBell /> Voorzieningen</h3>
        <div className="grid-container facilities-grid">
          <p><FaBed /> Luxe tweepersoonsbed</p>
          <p><FaBath /> Moderne badkamer met douche</p>
          <p><FaTv /> Smart-tv</p>
          <p><FaUtensils /> Volledig uitgeruste keuken</p>
          <p><FaGlassCheers  /> Vaatwasser</p> 
          <p><FaCouch /> Zithoek met slaapbank</p>
          <p><FaCouch /> Uitklapbaar zetelbed</p>
          <p><FaSnowflake /> Airconditioning en verwarming</p>
          <p><FaLayerGroup /> Beddenlakens voorzien</p> 
          <p><FaCar /> Meerdere parkeergelegenheiden</p>
          <p><FaDog /> Huisdieren niet toegestaan</p>
          <p><FaConciergeBell /> 24/7 klantenservice</p>
          <p><FaFireExtinguisher /> Brandblusser en rookmelders</p>
          <p><FaWifi /> Snelle WiFi</p>
        </div>
      </div>
      <div className="info-section">
        <h3><FaMapMarkerAlt /> Ligging & Omgeving</h3>
        <div className="grid-container location-grid">
          <div className="location-item">
            <FaUmbrellaBeach className="icon" />
            <div>
              <h4>Strand</h4>
              <p>Op slechts 50m van het zandstrand</p>
            </div>
          </div>
          <div className="location-item">
            <FaUtensils className="icon" />
            <div>
              <h4>Horeca</h4>
              <p>Verschillende restaurants binnen een radius van 100 meter.</p>
              <p>Supermarkt op 4 minuten wandelen</p>
            </div>
          </div>
          <div className="location-item">
            <FaBinoculars className="icon" />
            <div>
              <h4>Bezienswaardigheden</h4>
              <p>Zicht op casino Middelkerke</p>
              <p>Verschillende stripfiguur-standbeelden verspreid over de dijk</p>
            </div>
          </div>
        </div>
      </div>
      <div className="info-section">
        <h3><FaCalendarCheck />Beschikbaarheid</h3>
        <SmoobuWidget />
      </div>
      <div className="info-section reviews">
        <h3><FaStar /> Gastenoordelen</h3>
        <div className="grid-container review-carousel">
          <div className="review">
            <div className="rating">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p>"Fantastisch verblijf! Het appartement was ruim, licht en smaakvol ingericht. We werden elke ochtend wakker met het geluid van de zee en genoten van de zonsondergangen op het balkon. De locatie is perfect: dicht bij het strand, maar ook vlakbij leuke restaurants en winkels. Een absolute aanrader!"</p>
            <span>- Jasper, juli 2024</span>
          </div>
          <div className="review">
            <div className="rating">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p>"Een droomlocatie! Het uitzicht op zee vanaf het balkon was adembenemend, het geluid van de golven maakte onze vakantie extra bijzonder. Het appartement was modern, schoon en van alle gemakken voorzien. We komen zeker terug!"</p>
            <span>- Gust, november 2024</span>
          </div>
        </div>
      </div>
      <div className="info-section">
        <h3><FaScroll /> Huisregels</h3>
        <div className="grid-container rules-grid">
          <div>
            <FaClock />
            <p>Check-in vanaf 16:00, check-out tot 10:00</p>
          </div>
          <div>
            <FaSmokingBan />
            <p>Rookvrij appartement</p>
          </div>
          <div>
          <FaVolumeMute />
            <p>Geen feestjes of luidruchtige activiteiten</p>
          </div>
        </div>
      </div>
      <div className="info-section safety">
        <h3><FaShieldAlt /> Veiligheidsmaatregelen</h3>
        <div className="grid-container safety-grid">
          <div className="safety-item">
            <FaHandsWash />
            <p>Professionele reiniging tussen elke gast</p>
          </div>
          <div className="safety-item">
            <FaFirstAid />
            <p>EHBO-kit aanwezig</p>
          </div>
          <div className="safety-item">
            <FaSmokingBan />
            <p>Rookmelders en CO-detector</p>
          </div>
        </div>
      </div>
      <a href="/appartement/hoek/boeken" className="book-button">
        <FaCalendarCheck /> Direct Boeken
      </a>
    </section>
  );
}