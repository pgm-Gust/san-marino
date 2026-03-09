"use client";

import { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import "./ApartmentSlider.scss";

const apartments = [
  {
    id: 1,
    title: "Foto's",
    images: [
      "/assets/images/plein/Parijsstraat280402Middelkerke12.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke10.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke14.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke20.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke11.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke09.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke08.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke16.jpg",
      "/assets/images/plein/Parijsstraat280402Middelkerke18.jpg",
    ],
    link: "/appartement/plein",
  },
];

const ApartmentSlider = () => {
  const [currentIndices, setCurrentIndices] = useState({ 1: 0 });
  const [activeApartment, setActiveApartment] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionState, setTransitionState] = useState({});
  const [touchStartX, setTouchStartX] = useState(null);

  const handleSlide = (apartmentId, direction) => {
    if (transitionState[apartmentId]) return;

    const apartment = apartments.find((a) => a.id === apartmentId);
    const fromIndex = currentIndices[apartmentId] || 0;
    const toIndex =
      direction === "next"
        ? (fromIndex + 1) % apartment.images.length
        : fromIndex > 0
          ? fromIndex - 1
          : apartment.images.length - 1;

    setIsTransitioning(true);
    setTransitionState((prev) => ({
      ...prev,
      [apartmentId]: { fromIndex, toIndex, direction },
    }));

    setTimeout(() => {
      setCurrentIndices((prev) => ({
        ...prev,
        [apartmentId]: toIndex,
      }));

      setTransitionState((prev) => {
        const updated = { ...prev };
        delete updated[apartmentId];
        return updated;
      });

      setIsTransitioning(false);
    }, 300);
  };

  const openLightbox = (apartmentId, index) => {
    setActiveApartment(apartmentId);
    setCurrentIndices((prev) => ({ ...prev, [apartmentId]: index }));
    setIsLightboxOpen(true);
  };

  const goToSlide = (apartmentId, index) => {
    setCurrentIndices((prev) => ({
      ...prev,
      [apartmentId]: index,
    }));
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.changedTouches[0].clientX);
  };

  const handleTouchEnd = (event, apartmentId) => {
    if (touchStartX === null) return;
    const diff = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      handleSlide(apartmentId, diff < 0 ? "next" : "prev");
    }
    setTouchStartX(null);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setActiveApartment(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen && activeApartment) {
        switch (e.key) {
          case "ArrowRight":
            handleSlide(activeApartment, "next");
            break;
          case "ArrowLeft":
            handleSlide(activeApartment, "prev");
            break;
          case "Escape":
            closeLightbox();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, activeApartment, currentIndices]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    if (isLightboxOpen) return;

    const interval = setInterval(() => {
      apartments.forEach((apartment) => {
        if (transitionState[apartment.id]) return;
        handleSlide(apartment.id, "next");
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isLightboxOpen, currentIndices, transitionState]);

  return (
    <div className="apartments-grid">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="apartment-card">
          {(() => {
            const transition = transitionState[apartment.id];
            return (
              <div className="slider-container">
                <div className="slider">
                  <button
                    className="arrow left"
                    onClick={() => handleSlide(apartment.id, "prev")}
                    aria-label="Vorige foto"
                  >
                    <FaArrowLeft />
                  </button>

                  <div
                    className={`image-wrapper ${isTransitioning ? "is-transitioning" : ""}`}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={(event) => handleTouchEnd(event, apartment.id)}
                  >
                    {transition ? (
                      <>
                        <img
                          src={apartment.images[transition.fromIndex]}
                          alt={apartment.title}
                          className={`main-image slide-layer slide-current ${transition.direction}`}
                          loading="lazy"
                        />
                        <img
                          src={apartment.images[transition.toIndex]}
                          alt={apartment.title}
                          className={`main-image slide-layer slide-next ${transition.direction}`}
                          loading="lazy"
                        />
                      </>
                    ) : (
                      <img
                        src={apartment.images[currentIndices[apartment.id]]}
                        alt={apartment.title}
                        onClick={() =>
                          openLightbox(
                            apartment.id,
                            currentIndices[apartment.id],
                          )
                        }
                        className="main-image static"
                        loading="lazy"
                      />
                    )}
                  </div>

                  <button
                    className="arrow right"
                    onClick={() => handleSlide(apartment.id, "next")}
                    aria-label="Volgende foto"
                  >
                    <FaArrowRight />
                  </button>
                </div>

                <div className="slide-counter" aria-live="polite">
                  {currentIndices[apartment.id] + 1} / {apartment.images.length}
                </div>
              </div>
            );
          })()}

          <div className="slider-dots">
            {apartment.images.map((_, index) => (
              <button
                key={`dot-${index}`}
                className={`dot ${
                  index === currentIndices[apartment.id] ? "active" : ""
                }`}
                onClick={() => goToSlide(apartment.id, index)}
                aria-label={`Ga naar foto ${index + 1}`}
              />
            ))}
          </div>

          <div className="thumbnails">
            {apartment.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${
                  index === currentIndices[apartment.id] ? "active" : ""
                }`}
                onClick={() => goToSlide(apartment.id, index)}
                loading="lazy"
              />
            ))}
          </div>

          <div className="details-overlay">
            <h3>{apartment.title}</h3>
            <a href={apartment.link} className="cta-btn">
              Bekijk details <FaArrowRight />
            </a>
          </div>
        </div>
      ))}

      {isLightboxOpen && activeApartment && (
        <div
          className="lightbox"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <button className="close-btn" onClick={closeLightbox}>
            &times;
          </button>
          <div className="lightbox-content">
            <button
              className="lightbox-arrow left"
              onClick={() => handleSlide(activeApartment, "prev")}
            >
              <FaArrowLeft />
            </button>

            <img
              src={
                apartments.find((a) => a.id === activeApartment).images[
                  currentIndices[activeApartment]
                ]
              }
              alt="Appartement"
              className="lightbox-image"
            />

            <button
              className="lightbox-arrow right"
              onClick={() => handleSlide(activeApartment, "next")}
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="lightbox-thumbnails">
            {apartments
              .find((a) => a.id === activeApartment)
              .images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    index === currentIndices[activeApartment] ? "active" : ""
                  }`}
                  onClick={() => {
                    setCurrentIndices((prev) => ({
                      ...prev,
                      [activeApartment]: index,
                    }));
                  }}
                  loading="lazy"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentSlider;
