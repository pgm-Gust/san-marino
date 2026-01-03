"use client";

import React from "react";
import * as Icons from "react-icons/fa";
import SmoobuWidget from "@components/SmoobuWidget/SmoobuWidget";
import AvailabilityCalendar from "@components/AvailabilityCalendar/AvailabilityCalendar";
import Link from "next/link";

// Dynamische icon renderer
const DynamicIcon = ({ iconName }) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? <IconComponent /> : null;
};

export default function DynamicApartment({ apartment, images, reviews }) {
  return (
    <section className="apartment-overview">
      <p className="subheading">
        {apartment.subtitle || "Luxe vakantieverblijf"}
      </p>
      <h2>{apartment.name}</h2>

      {/* Gallery */}
      <div className="apartment-gallery">
        {images && images.length > 0 ? (
          <div className="gallery-grid">
            {images.slice(0, 5).map((image, index) => (
              <div
                key={image.id}
                className={`gallery-item ${index === 0 ? "main" : ""}`}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || apartment.name}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-images">Geen foto's beschikbaar</div>
        )}
      </div>

      {/* Beschrijving */}
      {apartment.description && (
        <div className="description-section">
          <p>{apartment.description}</p>
        </div>
      )}

      {/* Voorzieningen */}
      {apartment.facilities && apartment.facilities.length > 0 && (
        <div className="info-section">
          <h3>
            <Icons.FaConciergeBell /> Voorzieningen
          </h3>
          <div className="grid-container facilities-grid">
            {apartment.facilities.map((facility, index) => (
              <p key={index}>
                <DynamicIcon iconName={facility.icon} /> {facility.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Locatie */}
      {apartment.location_details &&
        Object.keys(apartment.location_details).length > 0 && (
          <div className="info-section">
            <h3>
              <Icons.FaMapMarkerAlt /> Ligging & Omgeving
            </h3>
            <div className="grid-container location-grid">
              {apartment.location_details.items?.map((item, index) => (
                <div key={index} className="location-item">
                  <DynamicIcon iconName={item.icon} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <div className="info-section">
          <h3>
            <Icons.FaStar /> Gastbeoordelingen
          </h3>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <strong>{review.author_name}</strong>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Icons.FaStar
                        key={i}
                        className={i < review.rating ? "filled" : "empty"}
                      />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
                {review.stay_date && (
                  <small>
                    Verblijf:{" "}
                    {new Date(review.stay_date).toLocaleDateString("nl-BE")}
                  </small>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Huisregels */}
      {apartment.house_rules && apartment.house_rules.length > 0 && (
        <div className="info-section">
          <h3>
            <Icons.FaScroll /> Huisregels
          </h3>
          <div className="rules-grid">
            {apartment.house_rules.map((rule, index) => (
              <p key={index}>
                <DynamicIcon iconName={rule.icon} /> {rule.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Beschikbaarheid */}
      <div className="info-section">
        <h3>
          <Icons.FaCalendarCheck /> Beschikbaarheid & Reserveren
        </h3>
        <AvailabilityCalendar />
        <div className="booking-actions">
          <Link href="/contact" className="btn-secondary">
            <Icons.FaEnvelope /> Stel een vraag
          </Link>
        </div>
      </div>

      {/* Smoobu Widget (optioneel) */}
      {apartment.smoobu_id && (
        <SmoobuWidget apartmentId={apartment.smoobu_id} />
      )}
    </section>
  );
}
