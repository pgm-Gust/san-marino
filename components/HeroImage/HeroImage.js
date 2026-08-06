import React from "react";
import Image from "next/image";
import "./HeroImage.scss";
import { FaArrowRight } from "react-icons/fa";

const HeroImage = () => {
  return (
    <div className="image-container">
      <Image
        src="/assets/images/breadcrumb.jpg"
        alt="Prachtig uitzicht op het strand van Middelkerke vanaf San Marino 4 vakantiestudio"
        className="full-width-image"
        width={1280}
        height={322}
        priority
        sizes="100vw"
      />
      <div className="image-overlay">
        <div className="overlay-content container">
          <h2>
            Jouw vakantie begint hier <br />
            Boek jouw verblijf aan zee!
          </h2>
          <a href="/appartement/plein" className="button">
            Boek nu
            <FaArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
