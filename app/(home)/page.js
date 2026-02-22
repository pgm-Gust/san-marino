import React from "react";
import HomePageClientWrapper from "@components/HomePageClientWrapper/HomePageClientWrapper";
import "./page.scss";

export const metadata = {
  title: "Luxe vakantiestudio aan Zee in Middelkerke",
  description:
    "Direct aan de dijk in Middelkerke - Moderne appartementen voor 4 personen met panoramisch zeezicht. Boek nu uw perfecte strandvakantie!",
  openGraph: {
    images: [{ url: "/og-home.jpg" }],
  },
};

export default function HomePage() {
  return <HomePageClientWrapper />;
}
