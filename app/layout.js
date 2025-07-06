import { generateSeo } from "../config/seo.config";
import "@styles/globals.css";
import Navbar from "@components/NavBar/Navbar";
import Footer from "@components/Footer/Footer";

export const metadata = {
  title: "Appartement San Marino - Luxe vakantieverblijf in San Marino",
  description:
    "Luxe vakantiestudio in het centrum van Middelkerke. Geniet van een unieke vakantie in deze prachtige stad met adembenemend uitzicht op de zee.",
  keywords:
    "San Marino appartement, vakantieverblijf San Marino, luxe vakantiestudio, centrum Middelkerke, vakantie Middelkerke",
  openGraph: {
    title: "Appartement San Marino - Luxe vakantieverblijf in Middelkerke",
    description:
      "Luxe vakantiestudio in het centrum van Middelkerke. Geniet van een unieke vakantie in deze prachtige stad met adembenemend uitzicht op de zee.",
    images: [
      {
        url: "/images/apartment-main.jpg",
        width: 1200,
        height: 630,
        alt: "Luxe vakantiestudio San Marino",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://san-marino-appartement.nl",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
