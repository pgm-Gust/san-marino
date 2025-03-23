import React from "react";
import { FaMapMarkerAlt, FaUmbrellaBeach, FaUtensils, FaBinoculars } from "react-icons/fa";

export default function LocationSection() {
  return (
    <div className="info-section">
      <h2>
        <FaMapMarkerAlt /> Ligging &amp; Omgeving
      </h2>
      <div className="grid-container location-grid">
        <div
          className="location-item"
          itemProp="location"
          itemScope
          itemType="http://schema.org/Place"
        >
          <FaUmbrellaBeach className="icon" />
          <div>
            <h3 itemProp="name">Strand</h3>
            <p itemProp="distance">
              Op slechts <span itemProp="value">50m</span> van het zandstrand
            </p>
          </div>
        </div>
        <div className="location-item">
          <FaUtensils className="icon" />
          <div>
            <h3>Horeca</h3>
            <p>
              Verschillende restaurants binnen <strong>100 meter</strong>
            </p>
            <p>
              Supermarkt op <strong>4 minuten</strong> wandelen
            </p>
          </div>
        </div>
        <div className="location-item">
          <FaBinoculars className="icon" />
          <div>
            <h3>Bezienswaardigheden</h3>
            <p>
              Zicht op <strong>Casino Middelkerke</strong>
            </p>
            <p>Stripfiguur-standbeelden op de dijk</p>
          </div>
        </div>
      </div>
    </div>
  );
}
