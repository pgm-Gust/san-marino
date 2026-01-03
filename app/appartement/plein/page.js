import React from "react";
import {
  FaWifi,
  FaTv,
  FaCar,
  FaDog,
  FaConciergeBell,
  FaUtensils,
  FaBed,
  FaBath,
  FaCouch,
  FaSnowflake,
  FaFireExtinguisher,
  FaClock,
  FaSmokingBan,
  FaMapMarkerAlt,
  FaStar,
  FaCalendarCheck,
  FaUmbrellaBeach,
  FaBinoculars,
  FaShieldAlt,
  FaHandsWash,
  FaFirstAid,
  FaScroll,
  FaVolumeMute,
  FaGlassCheers,
  FaLayerGroup,
} from "react-icons/fa";
import PleinGalleryClient from "@components/AppartmentGallery/PleinGalleryClient";
import SmoobuWidget from "@components/SmoobuWidget/SmoobuWidget";
import { generateSeo } from "/config/seo.config";
import SeoStructuredData from "@components/Seo/StructuredData";
import "./page.scss";
import Image from "next/image";
import AvailabilityCalendar from "@components/AvailabilityCalendar/AvailabilityCalendar";
import Link from "next/link";

export const metadata = generateSeo({
  title:
    "Luxe studio aan Zee Middelkerke | San Marino 4 studio",
  description:
    "Direct aan het plein in Middelkerke - Moderne studio voor 4 personen met panoramisch zeezicht. Boek nu uw perfecte vakantie!",
  openGraph: {
    images: [
      {
        url: "/og-plein-appartement.jpg",
        width: 1200,
        height: 630,
        alt: "San Marino 4 studio met zeezicht",
      },
    ],
  },
});

export default function PleinApartment() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: "Plein studio San Marino 4",
    description:
      "Luxe vakantiestudio aan het plein van Middelkerke met direct zeezicht",
    image: "/og-plein-appartement.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Zeelaan 4",
      addressLocality: "Middelkerke",
      postalCode: "8430",
      addressCountry: "BE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.1852,
      longitude: 2.8217,
    },
    numberOfRooms: 2,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: 4,
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Zeezicht" },
      { "@type": "LocationFeatureSpecification", name: "Smart TV" },
      { "@type": "LocationFeatureSpecification", name: "Airconditioning" },
    ],
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
      },
      author: {
        "@type": "Person",
        name: "Jasper",
      },
    },
  };

  // const images = await getPleinImages(); // Removed as everything is now client-side via PleinGalleryClient
  return (
    <>
      <SeoStructuredData data={structuredData} />

      <main itemScope itemType="https://schema.org/VacationRental">
        <section
          className="apartment-overview"
          itemScope
          itemType="http://schema.org/Accommodation"
        >
          <meta itemProp="priceRange" content="€150-€250 per nacht" />

          <p className="subheading">Luxe vakantieverblijf</p>
          <h1 itemProp="name">Studio met zicht op zee en plein</h1>

          <PleinGalleryClient />

          <div className="info-section">
            <h2>
              <FaConciergeBell /> Voorzieningen
            </h2>
            <div className="grid-container facilities-grid">
              {[
                { icon: <FaBed />, text: "Aparte slaapruimte met tweepersoonsbed", prop: "bed" },
                {
                  icon: <FaBath />,
                  text: "Moderne badkamer met douche",
                  prop: "bathroom",
                },
                { icon: <FaTv />, text: "Smart-tv", prop: "television" },
                {
                  icon: <FaUtensils />,
                  text: "Volledig uitgeruste keuken",
                  prop: "kitchen",
                },
                {
                  icon: <FaGlassCheers />,
                  text: "Vaatwasser",
                  prop: "dishwasher",
                },
                {
                  icon: <FaCouch />,
                  text: "Zithoek met slaapbank",
                  prop: "livingRoom",
                },
                {
                  icon: <FaLayerGroup />,
                  text: "Beddenlakens voorzien",
                  prop: "linens",
                },
                {
                  icon: <FaDog />,
                  text: "Huisdieren niet toegestaan",
                  prop: "petsAllowed",
                },
                {
                  icon: <FaFireExtinguisher />,
                  text: "Brandblusser en rookmelders",
                  prop: "safetyFeatures",
                },
                { icon: <FaWifi />, text: "Snelle WiFi", prop: "wifi" },
              ].map((item, index) => (
                <p key={index} itemProp="amenityFeature">
                  {item.icon} <span itemProp="name">{item.text}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h2>
              <FaMapMarkerAlt /> Ligging & Omgeving
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
                    Op slechts <span itemProp="value">50m</span> van het
                    zandstrand
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
                    Supermarkt op <strong>2 minuten</strong> wandelen
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

          <div className="info-section">
            <h2>
              <FaCalendarCheck /> Beschikbaarheid
            </h2>
            <AvailabilityCalendar />
          </div>
          <div className="info-section reviews">
            <h2>
              <FaStar /> Gastenoordelen
            </h2>
            <div className="grid-container review-carousel">
              {[
                {
                  rating: 5,
                  text: `"Elke ochtend wakker worden met het ruisen van de zee... Dit appartement geeft je het echte 'aan-zijn-van-de-kust'-gevoel. Onze kinderen hebben uren op het strand gespeeld dat letterlijk voor deur ligt!"`,
                  author: "Jasper, augustus 2024",
                },
                {
                  rating: 5,
                  text: `"De zonsopgangen vanaf het balkon zijn magisch! 's Avonds vielen we in slaap met het geluid van kabbelende golven. Perfecte locatie om de zee te proeven en alle voorzieningen binnen handbereik."`,
                  author: "Gust, september 2024",
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className="review"
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  <div
                    className="rating"
                    itemProp="reviewRating"
                    itemScope
                    itemType="https://schema.org/Rating"
                  >
                    <meta itemProp="ratingValue" content="5" />
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} aria-hidden="true" />
                    ))}
                  </div>
                  <p itemProp="reviewBody">{review.text}</p>
                  <div
                    className="review-author seaside-theme"
                    itemProp="author"
                  >
                    {review.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  <p>Rookvrije studio</p>
              </div>
              <div itemProp="noiseLevel">
                <FaVolumeMute />
                <p>Geen feestjes of luidruchtige activiteiten</p>
              </div>
            </div>
          </div>

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

          <div className="booking-cta">
            <Link href="/appartement/plein/boeken" className="book-now-button">
              Nu Boeken
              <FaCalendarCheck />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
