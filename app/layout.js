// import { generateSeo } from "../config/seo.config";
import "@styles/globals.css";
import Navbar from "@components/NavBar/Navbar";
import Footer from "@components/Footer/Footer";

export const metadata = {
  title: "San Marino 4 - Luxe vakantiestudio in Middelkerke",
  description:
    "Luxe vakantiestudio in het centrum van Middelkerke. Geniet van een unieke vakantie in deze prachtige stad met adembenemend uitzicht op de zee.",
  keywords:
    "San Marino 4, vakantieverblijf Middelkerke, luxe vakantiestudio, centrum Middelkerke, vakantie België kust",
  openGraph: {
    title: "San Marino 4 - Luxe vakantiestudio in Middelkerke",
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
    locale: "nl_BE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.sanmarino4.be",
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
