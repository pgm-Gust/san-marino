import React from "react";
import HomePageClientWrapper from "@components/HomePageClientWrapper/HomePageClientWrapper";
import "./page.scss";

export const metadata = {
  title: "Luxe vakantiestudio aan zee in Middelkerke",
  description:
    "Een modern appartement voor 4 personen met prachtig zeezicht, direct aan de dijk in Middelkerke. Boek nu en beleef de perfecte vakantie!",
  openGraph: {
    images: [{ url: "/og-home.jpg" }],
  },
};

export default function HomePage() {
  return <HomePageClientWrapper />;
}
