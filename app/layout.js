import { generateSeo } from '../config/seo.config';
import '@styles/globals.css';
import Navbar from '@components/NavBar/Navbar';
import Footer from '@components/Footer/Footer';

export const metadata = generateSeo({
  title: "San Marino 4 - Luxe vakantieappartementen Middelkerke",
  description: "Officiële website van San Marino 4 - Moderne appartementen aan zee",
});

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