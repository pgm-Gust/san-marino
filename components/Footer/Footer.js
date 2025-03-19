import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTripadvisor } from 'react-icons/fa';
import "./Footer.scss"

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section contact-info">
          <h3>Contact</h3>
          <ul>
            <li>
              <FaMapMarkerAlt className="footer-icon" />
              <span>Parijsstraat 22-28, 8430 Middelkerke</span>
            </li>
            <li>
              <FaPhone className="footer-icon" />
              <a href="tel:+32 474 98 40 81">+32 474 98 40 81</a>
            </li>
            <li>
              <FaEnvelope className="footer-icon" />
              <a href="mailto:info@sanmarino.be">info@sanmarino.be</a>
            </li>
          </ul>
        </div>

        <div className="footer-section quick-links">
          <h3>Snelle links</h3>
          <nav>
            <a href="/appartementen">Appartementen</a>
            <a href="/locatie">Locatie</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>

        <div className="footer-section social-links">
          <h3>Volg ons</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="TripAdvisor">
              <FaTripadvisor />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} San Marino 4. Alle rechten voorbehouden.</p>
      </div>
    </footer>
  );
}