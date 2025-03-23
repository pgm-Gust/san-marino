import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import "./Footer.scss"

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content container">
        <div className="footer-section contact-info">
          <h3>Contact</h3>
          <ul>
            <li>
              <FaMapMarkerAlt className="footer-icon" />
              <span>Parijsstraat 28, 8430 Middelkerke</span>
            </li>
            <li>
              <FaPhone className="footer-icon" />
              <a href="tel:+32 474 98 40 81">+32 474 98 40 81</a>
            </li>
            <li>
              <FaEnvelope className="footer-icon" />
              <a href="mailto:hello@sanmarino4.be">hello@sanmarino4.be</a>
            </li>
          </ul>
        </div>

        <div className="footer-section quick-links">
          <h3>Snelle links</h3>
          <nav>
            <a href="/appartement/plein">Appartement</a>
            <a href="/locatie">Locatie</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>

        <div className="footer-section site-logo">
          <a href="/">
            <img 
              src="/logo.png" 
              alt="San Marino 4 Logo" 
              className="logo-image" 
            />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} San Marino 4. Alle rechten voorbehouden.</p>
      </div>
    </footer>
  );
}