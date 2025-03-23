import React from "react";
import { FaCalendarCheck } from "react-icons/fa";
import SeoStructuredData from "@components/Seo/StructuredData";
import { generateSeo } from "/config/seo.config";

import ApartmentOverview from "@components/ApartmentComponents/ApartmentOverview";
import FacilitiesSection from "@components/ApartmentComponents/FacilitiesSection";
import LocationSection from "@components/ApartmentComponents/LocationSection";
import AvailabilitySection from "@components/ApartmentComponents/AvailabilitySection";
import ReviewsSection from "@components/ApartmentComponents/ReviewsSection";
import HouseRulesSection from "@components/ApartmentComponents/HouseRulesSection";
import SafetySection from "@components/ApartmentComponents/SafetySection";
import BookButton from "@components/ApartmentComponents/BookButton";

import "./page.scss";

export const metadata = generateSeo({
  title: "Luxe Appartement aan Zee Middelkerke",
  description:
    "Direct aan het plein in Middelkerke - Modern appartement voor 4 personen met prachtig zeezicht. Boek nu uw perfecte vakantie!",
  openGraph: {
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "San Marino 4 Plein Appartement met zeezicht",
      },
    ],
  },
});

export default function PleinApartment() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: "Plein Appartement San Marino 4",
    description:
      "Luxe vakantieappartement aan het plein van Middelkerke met direct zeezicht",
    image: "/og-default.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Parijsstraat 28",
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

  return (
    <>
      <SeoStructuredData data={structuredData} />
      <main itemScope itemType="https://schema.org/VacationRental">
        <section
          className="apartment-overview"
          itemScope
          itemType="http://schema.org/Accommodation"
        >
          <ApartmentOverview />
          <FacilitiesSection />
          <LocationSection />
          <AvailabilitySection />
          <ReviewsSection />
          <HouseRulesSection />
          <SafetySection />
          <BookButton />
        </section>
      </main>
    </>
  );
}
