const SeoStructuredData = ({ type = "VacationRental", data }) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": "https://www.sanmarino4.be/#vacationrental",
    identifier: "san-marino-4-middelkerke",
    name: "San Marino 4",
    description:
      "Luxe vakantiestudio in Middelkerke met zeezicht, geschikt voor 4 personen. Moderne inrichting met wifi, volledig uitgeruste keuken. Boek nu uw perfecte strandvakantie!",
    image: [
      "https://www.sanmarino4.be/logo.png",
      "https://www.sanmarino4.be/og-home.jpg",
      "https://www.sanmarino4.be/og-plein-appartement.jpg",
    ],
    url: "https://www.sanmarino4.be",
    telephone: "+32-474-98-40-81",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Parijsstraat 28",
      addressLocality: "Middelkerke",
      addressRegion: "West-Vlaanderen",
      postalCode: "8430",
      addressCountry: "BE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "51.1852",
      longitude: "2.8217",
    },
    containedInPlace: {
      "@type": "Place",
      name: "Middelkerke",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Middelkerke",
        addressRegion: "West-Vlaanderen",
        addressCountry: "BE",
      },
    },
    containsPlace: [
      {
        "@type": "Accommodation",
        "@id": "https://www.sanmarino4.be/appartement/plein",
        name: "Studio Plein",
        description: "Luxe vakantiestudio met zeezicht.",
        numberOfRooms: 1,
        occupancy: {
          "@type": "QuantitativeValue",
          value: 4,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ ...baseSchema, ...data }),
      }}
    />
  );
};

export default SeoStructuredData;
