"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@components/LoadingScreen/LoadingScreen";

// Importeer alle componenten die eerder in app/(home)/page.js stonden
import ApartmentSlider from "@components/ApartmentSlider/ApartmentSlider";
import SpecialFeatures from "@components/SpecialFeatures/SpecialFeatures";
import NextWeekend from "@components/AvailabilityNextWeekend/NextWeekend";
import HeroImage from "@components/HeroImage/HeroImage";
import Contact from "@components/Contact/Contact";
import SeoStructuredData from "@components/Seo/StructuredData";

import "../../app/(home)/page.scss"; // Importeer de homepagina specifieke CSS indien nodig

const HomePageClientWrapper = () => {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [hasMinTimePassed, setHasMinTimePassed] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const minDisplayTime = 500; // Minimale tijd dat het laadscherm wordt weergegeven (in ms)

  useEffect(() => {
    // Zorg ervoor dat het laadscherm minimaal een bepaalde tijd zichtbaar is
    const timer = setTimeout(() => {
      setHasMinTimePassed(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Controleer of de pagina al geladen is bij het mounten van het component
    if (document.readyState === "complete") {
      setIsPageLoaded(true);
    } else {
      // Luister naar de 'load' gebeurtenis van het venster
      const handleLoad = () => setIsPageLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  useEffect(() => {
    // Verberg het laadscherm pas als de minimale tijd verstreken is EN de pagina geladen is
    if (hasMinTimePassed && isPageLoaded) {
      setShowLoadingScreen(false);
    }
  }, [hasMinTimePassed, isPageLoaded]);

  return (
    <>
      <AnimatePresence>
        {showLoadingScreen && <LoadingScreen key="loading-screen" />}
      </AnimatePresence>

      {/* Render de hoofdinhoud alleen als het laadscherm verborgen is */}
      {!showLoadingScreen && (
        <main>
          <SeoStructuredData
            data={{
              numberOfRooms: 1,
              occupancy: {
                "@type": "QuantitativeValue",
                value: 4,
              },
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Wifi",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Zeezicht",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Strandaccess",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Parking",
                  value: true,
                },
              ],
              petsAllowed: false,
            }}
          />

          <section className="home-container">
            <div className="overlay" style={{ position: "relative" }}>
              {/* NextWeekend linksboven in de hero banner */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  left: 24,
                  zIndex: 2,
                  maxWidth: 260,
                }}
              >
                <NextWeekend className="subtle-nextweekend" />
              </div>
              <h1>
                <span>Uw volgend verblijf in Middelkerke</span>
                <span className="white">San Marino 4</span>
                <span className="hero-logo-wrap">
                  <img
                    src="/logo.png"
                    alt="San Marino 4"
                    className="hero-logo"
                  />
                </span>
              </h1>
              <a
                href="/appartement/plein"
                className="button"
                aria-label="Bekijk beschikbaarheid van onze vakantiestudio"
              >
                Boek nu
              </a>
            </div>
          </section>

          <section className="appartment-container container">
            <h2>Moderne vakantiestudio met zeezicht in Middelkerke</h2>
            <p>
              Geniet van een prachtig verblijf in <strong>Middelkerke</strong>{" "}
              voor <strong>4 personen</strong>. Perfecte adres voor uw
              <strong> vakantie aan de Belgische Kust</strong> met exclusief{" "}
              <strong>zicht</strong> op strand en zee
            </p>

            <ApartmentSlider
              loading="lazy"
              aria-label="Foto's van onze vakantiestudio"
            />
          </section>

          <SpecialFeatures />

          <HeroImage altText="Uitzicht op de Noordzee vanaf het appartement" />

          <Contact />
        </main>
      )}
    </>
  );
};

export default HomePageClientWrapper;
