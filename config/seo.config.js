export const defaultMetadata = {
    metadataBase: new URL('https://www.sanmarino4.be'),
    alternates: {
      canonical: '/',
    },
    keywords: ["Middelkerke", "vakantieappartement", "zeezicht", "San Marino 4", "Belgische kust", "vakantie", "appartement", "strand", "zee", "kust", "vakantiehuis", "vakantieverblijf", "vakantiehuisje", "vakantiehuisjes", "vakantieverblijven", "vakantieappartementen", "vakantieappartementje", "vakantieappartementjes"],
    openGraph: {
      type: 'website',
      locale: 'nl_BE',
      siteName: 'San Marino 4 Middelkerke',
      images: [
        {
          url: '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'San Marino 4 aan de kust',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
  
  export const generateSeo = (pageData) => ({
    ...defaultMetadata,
    ...pageData,
    title: pageData.title ? `${pageData.title} | San Marino 4` : defaultMetadata.title,
    description: pageData.description || defaultMetadata.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...pageData.openGraph,
      title: pageData.openGraph?.title || pageData.title || defaultMetadata.openGraph.title,
      description: pageData.openGraph?.description || pageData.description || defaultMetadata.description,
      images: pageData.openGraph?.images || defaultMetadata.openGraph.images,
    },
  });