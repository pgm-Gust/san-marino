import React from "react";
import { FaScroll, FaClock, FaSmokingBan, FaVolumeMute, FaDog } from "react-icons/fa";

export default function HouseRulesSection() {
  return (
    <div className="info-section">
      <h2>
        <FaScroll /> Huisregels
      </h2>
      <div className="grid-container rules-grid">
        <div itemProp="houseRules">
          <FaClock />
          <p>Check-in vanaf 16:00, check-out tot 16:00</p>
        </div>
        <div itemProp="smokingAllowed" content="false">
          <FaSmokingBan />
          <p>Rookvrij appartement</p>
        </div>
        <div itemProp="noiseLevel">
          <FaVolumeMute />
          <p>Geen feestjes of luidruchtige activiteiten</p>
        </div>
        <div itemProp="noiseLevel">
          <FaDog />
          <p>Huisdieren niet toegestaan</p>
        </div>
      </div>
    </div>
  );
}
