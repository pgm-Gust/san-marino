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
            <p>Parijsstraat 28</p>
          </div>
        </header>

        <section id="locatie-info" className="section">
          <h2>Algemene Informatie — Middelkerke</h2>
          <p>
            Middelkerke is een ontspannen kustplaats met een mix van residentiële wijken, winkels en horeca. 
            De zeedijk en het strand zijn eenvoudig te bereiken te voet vanuit het centrum. Middelkerke biedt 
            een goede combinatie van rust en lokale voorzieningen voor korte en langere verblijven.
          </p>
          <p>
            Enkele praktische punten over de locatie:
          </p>
          <ul>
            <li><strong>Strand en zeedijk:</strong> bereikbaar te voet in enkele minuten — ideaal voor ochtendwandelingen en zonsondergangen.</li>
            <li><strong>Kusttram:</strong> de Kusttram (De Lijn) heeft haltes op korte loopafstand en verbindt de kustgemeenten van De Panne tot Knokke.</li>
            <li><strong>Voorzieningen:</strong> supermarkten, bakkerijen, apotheek en huisartsen zijn in de wijk of op korte loopafstand aanwezig.</li>
            <li><strong>Parkeren:</strong> er geldt grotendeels betaald parkeren bij de zeedijk; in de zijstraten kan korte termijn parkeren mogelijk zijn.</li>
          </ul>
          <p>
            Middelkerke is een toegankelijke bestemming: vanuit Oostende bent u binnen 10–15 minuten met de auto, en de E40 biedt goede verbindingen naar Brussel en Gent.
          </p>
        </section>

        <section id="strand-en-water" className="section">
          <h2>Strand & Wateractiviteiten nabij Parijsstraat 28</h2>
          <p>
            Het strand bij Middelkerke is breed en goed onderhouden. In het hoogseizoen zijn er bewaakte zwemplekken met badmeesters. Het zandstrand leent zich uitstekend voor gezinnen met kinderen en voor lange wandelingen langs de kust.
          </p>
          <p>
            Activiteiten en voorzieningen:
          </p>
          <ul>
            <li><strong>Watersporten:</strong> windsurfen, kitesurfen, kajakken en stand-up paddling — verhuurpunten vindt u langs de dijk.</li>
            <li><strong>Strandzeilen (landsailing):</strong> bij eb is dit op bepaalde stukken strand mogelijk onder begeleiding.</li>
            <li><strong>Fietsen en skeeleren:</strong> de dijk is vlak en uitermate geschikt voor een tochtje met huurfietsen of lange skates.</li>
          </ul>
          <p>
            Tip: check bij lokale paviljoens of er georganiseerde activiteiten of lessen zijn (windsurf, SUP), zeker in het toeristenseizoen.
          </p>
        </section>

        <section id="familie-activiteiten" className="section">
          <h2>Gezinsactiviteiten & uitstapjes</h2>
          <p>
            Rond Parijsstraat 28 zijn veel kindvriendelijke opties. De brede stranden en veilige waterzones zijn ideaal voor jonge kinderen. Tijdens de zomer organiseert de gemeente vaak animatie en speelactiviteiten op het strand.
          </p>
          <p>
            Aanraders voor daguitstapjes:
          </p>
          <ul>
            <li><strong>Plopsaland De Panne:</strong> perfect voor gezinnen met jonge kinderen (ca. 30–40 min rijden).</li>
            <li><strong>Bellewaerde Park:</strong> combi van attracties en dieren (leuke familiedag).</li>
            <li><strong>Noordzee Aquarium Oostende:</strong> kort uitstapje naar Oostende voor zee- en museumervaringen.</li>
          </ul>
        </section>

        <section id="eten-en-drinken" className="section">
          <h2>Eten & Drinken in de buurt</h2>
          <p>
            Langs de zeedijk en in het centrum van Middelkerke vindt u een mix van strandpaviljoens, visrestaurants en gezellige brasseries. Verse zeeproducten — garnalen, mosselen en vis — zijn een lokale specialiteit.
          </p>
          <p>
            Praktische tips:
          </p>
          <ul>
            <li>Voor snelle snacks en lokale frietwagens zijn er meerdere opties langs de promenade.</li>
            <li>Reserveer vooral in het hoogseizoen bij populaire restaurants op de dijk.</li>
            <li>Voor uitgebreide keuzes rijdt u in 10 minuten naar Oostende.</li>
          </ul>
        </section>

        <section id="winkelen" className="section">
          <h2>Winkelen & markten</h2>
          <p>
            Voor dagelijkse boodschappen is er een supermarkt in de buurt. In het toeristenseizoen zijn er wekelijkse markten met verse producten, bloemen en lokale specialiteiten.
          </p>
          <p>
            Voor grotere boodschappen of uitgestrekte winkelstraten is Oostende de meest voor de hand liggende keuze.
          </p>
        </section>

        <section id="cultuur-en-geschiedenis" className="section">
          <h2>Cultuur & bezienswaardigheden</h2>
          <p>
            In de directe omgeving vindt u zowel rustige wandelroutes als culturele uitstappen. Domein Raversyde is bijzonder interessant voor wie meer wil weten over de Atlantikwall en de lokale geschiedenis.
          </p>
          <p>
            Andere culturele stops:
          </p>
          <ul>
            <li>MU.ZEE en James Ensorhuis in Oostende — moderne en historische kunst.</li>
            <li>Kustfietsroute — maak een fietstocht langs de volledige kustlijn.</li>
          </ul>
        </section>

        <section id="praktische-info" className="section">
          <h2>Praktische informatie & lokale tips</h2>
          <p>
            <strong>Bereikbaarheid:</strong> Middelkerke is makkelijk te bereiken met de auto en het openbaar vervoer. De Kusttram is een handige manier om zonder auto meerdere kustplaatsen te bezoeken.
          </p>
          <p>
            <strong>Parkeren:</strong> betaalzones gelden vooral langs de zeedijk; in woonstraten kunnen lokale regels of vergunningen van toepassing zijn. Controleer altijd de parkeermeters of borden.
          </p>
          <p>
            <strong>Openbaar vervoer:</strong> Kusttram en regionale buslijnen verbinden naar Oostende, Nieuwpoort en andere kustplaatsen. Een dag- of meerdaagse tramkaart kan voordelig zijn wanneer u meerdere keren reist.
          </p>
          <p>
            <strong>Medische hulp:</strong> huisartsen en apotheken zijn in de buurt; voor ziekenhuiszorg is <strong>AZ Damiaan (Oostende)</strong> het meest dichtbij. Noodnummers: bel <strong>112</strong> voor urgente hulp.
          </p>
          <p>
            <strong>Seizoensadvies:</strong> in juli-augustus is het drukker en is het verstandig om accommodatie en favoriete restaurants vooraf te reserveren. Voor rustiger bezoek kies voor mei-juni of september-oktober.
          </p>
          <p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Parijsstraat+28,+8430+Middelkerke"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Maps — Parijsstraat 28
            </a>
          </p>
        </section>

        <section id="kaart" className="section">
          <h2>Kaart & Routebeschrijving</h2>
          <div className="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2526.7551139743687!2d2.8116398766308106!3d51.18763977174239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dca45561b94187%3A0x9f5e700630a34b27!2sParijsstraat%2028%2C%208430%20Middelkerke!5e1!3m2!1snl!2sbe!4v1763409110781!5m2!1snl!2sbe"
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
