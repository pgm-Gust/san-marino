"use client";

import React from "react";
import ApartmentSlider from "@components/ApartmentSlider/ApartmentSlider";
import SpecialFeatures from "@components/SpecialFeatures/SpecialFeatures";
import NextWeekend from "@components/AvailabilityNextWeekend/NextWeekend";
import HeroImage from "@components/HeroImage/HeroImage";
import Contact from "@components/Contact/Contact";
import SeoStructuredData from "@components/Seo/StructuredData";

import "../../app/(home)/page.scss";

const HomePageClientWrapper = () => {
  return (
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
              <img src="/logo.png" alt="San Marino 4" className="hero-logo" />
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
  );
};

export default HomePageClientWrapper;
