import React from "react";
import "./HeroImage.scss";
import { FaArrowRight } from "react-icons/fa";

const HeroImage = () => {
  return (
    <div className="image-container">
      <img
        src="assets/images/breadcrumb.jpg"
        alt="Prachtig uitzicht op het strand van Middelkerke vanaf San Marino 4 vakantieappartement"
        className="full-width-image"
        loading="lazy"
      />
      <div className="image-overlay">
        <div className="overlay-content container">
          <h2>
            Jouw vakantie begint hier <br />
            Boek jouw appartement aan zee!
          </h2>
          <a href="/appartementen" className="button">
            Boek nu
            <FaArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
