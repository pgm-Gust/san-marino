import React from "react";
import { FaShieldAlt, FaHandsWash, FaFirstAid, FaSmokingBan } from "react-icons/fa";

export default function SafetySection() {
  return (
    <div className="info-section safety">
      <h2>
        <FaShieldAlt /> Veiligheidsmaatregelen
      </h2>
      <div className="grid-container safety-grid">
        <div className="safety-item" itemProp="healthAndSafetyPolicy">
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
  );
}
