import Appartement from "@components/Apartment/Apartment";
import React from "react";

export default function Appartementen() {
  return (
    <div className="apartments-container container">
      <Appartement
        image="/assets/images/plein/Parijsstraat280402Middelkerke08.jpg"
        title="Plein Appartement"
        subtitle="Uitzicht op strand en zee"
        features={[
          "🔑 Maximum 4 Personen",
          "🚭 Rookvrij",
          "🚫 Geen huisdieren",
          "🛏️ 2 Slaapkamers",
          "🛁 1 Badkamer",
          "🍳 Volledige keuken",
        ]}
        price={200}
        link="/appartement/plein/"
        rating={4.8}
        capacity={4}
        size={80}
        bedrooms={2}
        book="/appartement/plein/boeken"
        badge="Prijs Favoriet"
        loading="lazy"
      />

      <Appartement
        image="/assets/images/plein/Parijsstraat280402Middelkerke09.jpg"
        title="Hoek Appartement"
        subtitle="Uitzicht op strand en zee"
        features={[
          "🔑 Maximum 4 Personen",
          "🚭 Rookvrij",
          "🚫 Geen huisdieren",
          "🛏️ 2 Slaapkamers",
          "🛁 1 Badkamer",
          "🍳 Volledige keuken",
        ]}
        price={250}
        link="/appartement/hoek"
        rating={4.8}
        capacity={4}
        size={80}
        bedrooms={2}
        book="/appartement/hoek/boeken"
        badge="Nieuw"
        loading="lazy"
      />
    </div>
  );
}
