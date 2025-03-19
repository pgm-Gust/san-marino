import Appartement from "@components/Apartment/Apartment";
import React from "react";

export default function Appartementen() {
  return (
    <div className="apartments-container">

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
    "🍳 Volledige keuken"
  ]}
  price={200}
  link="/plein"
  rating={4.8}
  capacity={4}
  size={80}
  bedrooms={2}
  book="/boeken"
  badge="Prijs Favoriet"
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
    "🍳 Volledige keuken"
  ]}
  price={250}
  link="/hoek"
  rating={4.8}
  capacity={4}
  size={80}
  bedrooms={2}
  book="/boeken"
  badge="Nieuw"
/>
    </div>
  );
}