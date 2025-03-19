import React from "react";
import { FaStar, FaUsers, FaBed, FaRulerCombined, FaArrowRight, FaShoppingCart } from "react-icons/fa";
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
    <div className="apartment-container">
      <div className="image-container">
        <img src={image} alt={title} className="image" />
        <div className="badge">{badge}</div>
      </div>
      
      <div className="details">
        <div className="header">
          <div>
            <h2 className="title">{title}</h2>
            <p className="subtitle">{subtitle}</p>
          </div>
          <div className="rating">
            <FaStar />
            <span>{rating}</span>
          </div>
        </div>

        <div className="meta-info">
          <div className="meta-item">
            <FaUsers />
            <span>{capacity} Personen</span>
          </div>
          <div className="meta-item">
            <FaBed />
            <span>{bedrooms} Slaapkamers</span>
          </div>
          <div className="meta-item">
            <FaRulerCombined />
            <span>{size} m²</span>
          </div>
        </div>

        <ul className="features">
          {features.map((feature, index) => {
            const [emoji, ...textParts] = feature.split(" ");
            const text = textParts.join(" ");
            return (
              <li key={index}>
                <span role="img" aria-hidden="true">{emoji}</span>
                {text}
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
      <FaArrowRight />
    </a>
    <a href={book} className="button">
      Boek nu
      <FaShoppingCart />
    </a>
  </div>
</div>
      </div>
    </div>
  );
};

export default Appartement;