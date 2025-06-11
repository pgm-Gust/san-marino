"use client";
import React, { useState, useEffect } from "react";
import {
  FaInfoCircle,
  FaUmbrellaBeach,
  FaChild,
  FaUtensils,
  FaShoppingBag,
  FaLandmark,
  FaInfo,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./page.scss";

const navItems = [
  { id: "locatie-info", icon: <FaInfoCircle />, label: "Algemeen" },
  { id: "strand-en-water", icon: <FaUmbrellaBeach />, label: "Strand" },
  { id: "familie-activiteiten", icon: <FaChild />, label: "Familie" },
  { id: "eten-en-drinken", icon: <FaUtensils />, label: "Eten" },
  { id: "winkelen", icon: <FaShoppingBag />, label: "Winkelen" },
  { id: "cultuur-en-geschiedenis", icon: <FaLandmark />, label: "Cultuur" },
  { id: "praktische-info", icon: <FaInfo />, label: "Praktisch" },
  { id: "kaart", icon: <FaMapMarkerAlt />, label: "Kaart" },
];

const LocationPage = () => {
  const [activeSection, setActiveSection] = useState("locatie-info");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="location-container">
      <nav className="location-sidebar">
        <div className="location-nav-links">
          {navItems.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              className={`location-nav-link ${
                activeSection === item.id ? "active" : ""
              }`}
              data-active={activeSection === item.id}
            >
              <span className="location-nav-icon">{item.icon}</span>
              <span className="location-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      <main className="location-content">
        <header className="location-header">
          <h1>
            <span className="subtitle">Ontdek onze omgeving</span>
            Middelkerke & Omgeving
          </h1>
          <div className="address-box">
            <FaMapMarkerAlt className="pin-icon" />
            <p>Parijsstraat 28, Zeedijk 116</p>
          </div>
        </header>

        <section id="locatie-info" className="section">
          <h2>Algemene Informatie Middelkerke</h2>
          <p>
            Middelkerke is een charmante kustplaats aan de Belgische kust, die
            de perfecte mix biedt van rust en bruisende activiteiten. Ons
            appartement is ideaal gelegen, op loopafstand van het strand en
            diverse voorzieningen.
          </p>
          <p>
            Lees meer over Middelkerke op{" "}
            <a
              href="https://www.middelkerke.be/nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              de officiële website van Middelkerke
            </a>
            .
          </p>
        </section>

        <section id="strand-en-water" className="section">
          <h2>Strand & Wateractiviteiten</h2>
          <p>
            Geniet van de brede, schone stranden voor zonnebaden, zwemmen en
            wandelingen langs de dijk en strand. Diverse watersporten, zoals
            windsurfen, kitesurfen en stand-up paddling, zijn hier volop
            mogelijk.
          </p>
          <p>
            Bekijk meer informatie over watersporten via{" "}
            <a
              href="https://www.dekust.be/doen/watersporten-aan-zee"
              target="_blank"
              rel="noopener noreferrer"
            >
              De Kust - Watersporten aan Zee
            </a>
            .
          </p>
        </section>

        <section id="familie-activiteiten" className="section">
          <h2>Familie & Kindvriendelijke Activiteiten</h2>
          <p>
            Middelkerke biedt tal van activiteiten voor gezinnen, zoals
            speeltuinen, kinderclubs en minigolfbanen. Daarnaast worden er
            regelmatig lokale festivals en evenementen georganiseerd die perfect
            zijn voor jong en oud.
          </p>
          <p>
            Ontdek lokale evenementen op{" "}
            <a
              href="https://www.uitinvlaanderen.be/agenda/alle/8430-middelkerke?searchTerm=Middelkerke&gclid=Cj0KCQjwytS-BhCKARIsAMGJyzrFv89WhKLR9B4waCOxTZW_P50GA4k-VDQKEuq4oIxldIUD9kH46FkaAmmmEALw_wcB"
              target="_blank"
              rel="noopener noreferrer"
            >
              Uit in Vlaanderen - Middelkerke
            </a>
            .
          </p>
        </section>

        <section id="eten-en-drinken" className="section">
          <h2>Eten & Drinken</h2>
          <p>
            Ontdek de culinaire hoogtepunten van de omgeving met tal van
            restaurants, cafés en strandpaviljoens. Geniet van verse zeevruchten
            en internationale gerechten in een sfeervolle setting.
          </p>
          <p>
            Bekijk hier{" "}
            <a
              href="https://www.tripadvisor.nl/Tourism-g641831-Middelkerke_West_Flanders_Province-Vacations.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              TripAdvisor
            </a>{" "}
            voor de beste eetgelegenheden.
          </p>
        </section>

        <section id="winkelen" className="section">
          <h2>Winkelen & Lokale Markten</h2>
          <p>
            Er zijn diverse boetieks, souvenirwinkels en wekelijkse markten in
            de buurt. Verken de authentieke lokale winkels en vind unieke
            producten en ambachtelijke specialiteiten.
          </p>
        </section>

        <section id="cultuur-en-geschiedenis" className="section">
          <h2>Cultuur, Geschiedenis & Recreatie</h2>
          <p>
            Verken de rijke geschiedenis van Middelkerke via lokale musea,
            historische gebouwen en culturele centra. Daarnaast zijn er volop
            mogelijkheden voor sportieve activiteiten, zoals fietsen en joggen.
          </p>
          <p>
            Meer weten over de geschiedenis? Bezoek de{" "}
            <a
              href="https://www.middelkerke.be"
              target="_blank"
              rel="noopener noreferrer"
            >
              officiële website van Middelkerke
            </a>
            .
          </p>
        </section>

        <section id="praktische-info" className="section">
          <h2>Praktische Informatie</h2>
          <p>
            De omgeving beschikt over alle benodigde voorzieningen, zoals
            supermarkten, apotheken, medische centra en openbaar vervoer. Ook is
            er voldoende parkeergelegenheid in de buurt.
          </p>
          <p>
            Plan uw route via{" "}
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Maps
            </a>
            .
          </p>
        </section>

        <section id="kaart" className="section">
          <h2>Kaart & Routebeschrijving</h2>
          <div className="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12635.632325004444!2d2.9180284175773386!3d51.2058277983657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f2cb5d8760f7%3A0x8e89a90b537e8b53!2sParijsstraat%2022-28%2C%20Zeedijk%20116%20%28Middelkerke%29!5e0!3m2!1snl!2sbe!4v1677864778700!5m2!1snl!2sbe"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </main>

      <nav className="location-mobile-nav">
        {navItems.map((item) => (
          <a
            href={`#${item.id}`}
            key={item.id}
            className={`location-mobile-nav-item ${
              activeSection === item.id ? "active" : ""
            }`}
          >
            {item.icon}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default LocationPage;
