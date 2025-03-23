import React from "react";
import {
  FaConciergeBell,
  FaBed,
  FaCouch,
  FaBath,
  FaTv,
  FaUtensils,
  FaGlassCheers,
  FaSnowflake,
  FaLayerGroup,
  FaCar,
  FaFireExtinguisher,
  FaWifi,
} from "react-icons/fa";

export default function FacilitiesSection() {
  const facilities = [
    { icon: <FaBed />, text: "Tweepersoonsbed", prop: "bed" },
    { icon: <FaCouch />, text: "Uitklapbaar zetelbed", prop: "livingRoom" },
    { icon: <FaBath />, text: "Moderne badkamer met douche", prop: "bathroom" },
    { icon: <FaTv />, text: "Smart-tv", prop: "television" },
    {
      icon: <FaUtensils />,
      text: "Volledig uitgeruste keuken",
      prop: "kitchen",
    },
    { icon: <FaGlassCheers />, text: "Vaatwasser", prop: "dishwasher" },
    {
      icon: <FaSnowflake />,
      text: "Airconditioning en verwarming",
      prop: "airConditioning",
    },
    { icon: <FaLayerGroup />, text: "Beddenlakens voorzien", prop: "linens" },
    {
      icon: <FaCar />,
      text: "Meerdere parkeergelegenheiden op openbare parkings",
      prop: "parking",
    },
    {
      icon: <FaFireExtinguisher />,
      text: "Brandblusser en rookmelders",
      prop: "safetyFeatures",
    },
    { icon: <FaWifi />, text: "Snelle WiFi", prop: "wifi" },
  ];

  return (
    <div className="info-section">
      <h2>
        <FaConciergeBell /> Voorzieningen
      </h2>
      <div className="grid-container facilities-grid">
        {facilities.map((item, index) => (
          <p key={index} itemProp="amenityFeature">
            {item.icon} <span itemProp="name">{item.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
