import React from "react";
import ApartmentSlider from "@components/ApartmentSlider/ApartmentSlider";
import SpecialFeatures from "@components/SpecialFeatures/SpecialFeatures";
import HeroImage from "@components/HeroImage/HeroImage";
import Contact from "@components/Contact/Contact";
import SeoStructuredData from "@components/Seo/StructuredData";
import { generateSeo } from '/config/seo.config';
import "./page.scss";

export const metadata = generateSeo({
  title: "Startpagina",
  description: "Direct aan de dijk in Middelkerke - Moderne appartementen voor 4 personen met prachtig zeezicht. Boek nu uw perfecte strandvakantie!",
  openGraph: {
    images: [{ url: '/og-home.jpg' }]
  }
});

export default function HomePage() {
  return (
    <>
      <SeoStructuredData 
        data={{
          geo: {
            latitude: 51.1852,
            longitude: 2.8217
          },
          priceRange: "€€",
          amenities: ["Wifi", "Zeezicht", "Strandaccess", "Parking"]
        }}
      />

      <main itemScope itemType="https://schema.org/VacationRental">
        <section className="home-container" itemScope itemType="http://schema.org/Place">
          <div className="overlay">
            <h1 itemProp="name">
              <span>Uw volgend verblijf in Middelkerke</span>
              <span className="white">San Marino 4</span>
            </h1>
            <a 
              href="/appartement/plein" 
              className="button"
              aria-label="Bekijk beschikbaarheid van onze vakantieappartementen"
              itemProp="url"
            >
              Boek nu
            </a>
          </div>
        </section>

        <section className="appartment-container container" itemScope itemType="http://schema.org/Accommodation">
          <h2>Modern vakantieappartement met zeezicht in Middelkerke</h2>
          <p itemProp="description">
            Geniet van een prachtig verblijf in <strong itemProp="address">Middelkerke </strong> 
            voor <strong itemProp="occupancy">4 personen</strong>. Perfecte adres voor uw 
            <strong> vakantie aan de Belgische Kust</strong> met exclusief <strong>zicht</strong> op strand en zee
          </p>

          
          <ApartmentSlider 
            loading="lazy" 
            aria-label="Foto's van onze vakantieappartementen"
          />
        </section>

        <SpecialFeatures />

        <HeroImage 
          altText="Uitzicht op de Noordzee vanaf het appartement" 
          itemProp="image"
        />

        <Contact />
      </main>
    </>
  );
}