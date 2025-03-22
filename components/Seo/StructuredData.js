const SeoStructuredData = ({ type = 'VacationRental', data }) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "name": "San Marino 4",
    "image": "/logo.png",
    "url": "https://www.sanmarino4.be",
    "telephone": "+32-474-98-40-81",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Parijsstraat 28",
      "addressLocality": "Middelkerke",
      "postalCode": "8430",
      "addressCountry": "BE"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...baseSchema, ...data }) }}
    />
  );
};

export default SeoStructuredData;