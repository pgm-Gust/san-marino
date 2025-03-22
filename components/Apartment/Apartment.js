import React from "react";
import { 
  FaStar, 
  FaUsers, 
  FaBed, 
  FaRulerCombined, 
  FaArrowRight, 
  FaShoppingCart 
} from "react-icons/fa";
import "./Apartment.scss";

const Appartement = ({ 
  image, 
  title, 
  subtitle, 
  features, 
  price, 
  link,
  rating,
  capacity,
  size,
  bedrooms,
  book,
  badge
}) => {
  return (
    <article className="apartment-container">
      <div className="image-container">
        <img src={image} alt={title} className="image" />
        {badge && <div className="badge">{badge}</div>}
      </div>
      
      <div className="details">
        <header className="header">
          <div>
            <h2 className="title">{title}</h2>
            <p className="subtitle">{subtitle}</p>
          </div>
          {rating && (
            <div className="rating" aria-label={`Rating: ${rating} sterren`}>
              <FaStar aria-hidden="true" />
              <span>{rating}</span>
            </div>
          )}
        </header>

        <div className="meta-info">
          <div className="meta-item">
            <FaUsers aria-hidden="true" />
            <span>{capacity} Personen</span>
          </div>
          <div className="meta-item">
            <FaBed aria-hidden="true" />
            <span>{bedrooms} Slaapkamers</span>
          </div>
          <div className="meta-item">
            <FaRulerCombined aria-hidden="true" />
            <span>{size} m²</span>
          </div>
        </div>

        <ul className="features">
          {features.map((feature, index) => {
            const [emoji, ...textParts] = feature.split(" ");
            const text = textParts.join(" ");
            return (
              <li key={index}>
                <span role="img" aria-label={text.trim()}>{emoji}</span>
                <span>{text}</span>
              </li>
            );
          })}
        </ul>

        <div className="price-section">
          <p className="price">
            €{price} 
            <span>per nacht</span>
          </p>
          <div className="button-group">
            <a href={link} className="button">
              Meer info
              <FaArrowRight aria-hidden="true" />
            </a>
            <a href={book} className="button">
              Boek nu
              <FaShoppingCart aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Appartement;