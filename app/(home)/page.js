import React from "react";
import ApartmentSlider from "@components/ApartmentSlider/ApartmentSlider";
import SpecialFeatures from "@components/SpecialFeatures/SpecialFeatures";
import HeroImage from "@components/HeroImage/HeroImage";
import Contact from "@components/Contact/Contact";

import "./page.scss";

export default function HomePage() {
  return (
    <>
      <section className="home-container">
        <div className="overlay">
          <h2>
            <span>Uw volgend verblijf in Middelkerke</span>

              <span className="white">San Marino 4</span>

          </h2>
          <a href="/appartementen" className="button">
            Boek nu
          </a>
        </div>
      </section>

      <section className="appartment-container">
        <h2>Twee gezellige en warme appartementen!</h2>
        <p>
          Geniet van een prachtig verblijf op de dijk van{" "}
          <strong>Middelkerke</strong> voor <strong>4 personen</strong>.
        </p>
        <p>Met een uitgebreid zicht op strand en zee</p>
        <ApartmentSlider />
      </section>

      <SpecialFeatures />

      <HeroImage />

      <Contact />
    </>
  );
}
