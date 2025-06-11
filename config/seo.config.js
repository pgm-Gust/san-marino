export const defaultMetadata = {
  metadataBase: new URL("https://www.sanmarino4.be"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "San Marino 4 Middelkerke",
    "San Marino 4",
    "San Marino",
    "Middelkerke",
    "Middelkerke aan zee",
    "Middelkerke aan de kust",
    "Middelkerke aan de Belgische kust",
    "vakantieappartement Middelkerke",
    "luxe appartement aan zee",
    "zeezicht Middelkerke",
    "vakantieverblijf Belgische kust",
    "appartement met zeezicht",
    "vakantie aan zee",
    "strandvakantie Middelkerke",
    "luxe vakantieappartement",
    "vakantiehuis Middelkerke",
    "vakantieverblijf aan zee",
    "appartement Belgische kust",
    "appartement Middelkerke",
    "appartement Middelkerke aan zee",
    "appartement Middelkerke aan de kust",
    "appartement Middelkerke aan de Belgische kust",
    "appartement Middelkerke aan de Belgische kust",
    "vakantiehuisje Middelkerke",
    "vakantieappartementen aan zee",
    "luxe vakantieverblijf",
    "vakantie aan de Belgische kust",
  ],
  openGraph: {
    type: "website",
    locale: "nl_BE",
    siteName: "San Marino 4 Middelkerke",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Luxe vakantieappartement San Marino 4 aan de Belgische kust in Middelkerke",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sanmarino4",
    creator: "@sanmarino4",
    title: "San Marino 4 - Luxe Vakantieappartementen Middelkerke",
    description:
      "Luxe vakantieappartementen aan zee in Middelkerke met panoramisch zeezicht",
    image: "/og-default.jpg",
  },
};

export const generateSeo = (pageData) => ({
  ...defaultMetadata,
  ...pageData,
  title: pageData.title
    ? `${pageData.title} | San Marino 4 Middelkerke`
    : defaultMetadata.title,
  description: pageData.description || defaultMetadata.description,
  openGraph: {
    ...defaultMetadata.openGraph,
    ...pageData.openGraph,
    title:
      pageData.openGraph?.title ||
      pageData.title ||
      defaultMetadata.openGraph.title,
    description:
      pageData.openGraph?.description ||
      pageData.description ||
      defaultMetadata.description,
    images: pageData.openGraph?.images || defaultMetadata.openGraph.images,
  },
});
