import React from "react";
import HomePageClientWrapper from "@components/HomePageClientWrapper/HomePageClientWrapper";
import { generateSeo } from "/config/seo.config";
import "./page.scss";

export const metadata = generateSeo({
  title: "Luxe Vakantieappartementen aan Zee in Middelkerke",
  description:
    "Direct aan de dijk in Middelkerke - Moderne appartementen voor 4 personen met panoramisch zeezicht. Boek nu uw perfecte strandvakantie!",
  openGraph: {
    images: [{ url: "/og-home.jpg" }],
  },
});

export default function HomePage() {
  return <HomePageClientWrapper />;
}
