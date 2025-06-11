import React, { useState, useEffect } from "react";

const ApartmentGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowLightbox(true);
  };

  const handleClose = () => {
    setShowLightbox(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((img) => img === selectedImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((img) => img === selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handleKeyDown = (e) => {
    if (!showLightbox) return;

    switch (e.key) {
      case "Escape":
        handleClose();
        break;
      case "ArrowLeft":
        handlePrev(e);
        break;
      case "ArrowRight":
        handleNext(e);
        break;
      default:
        break;
    }
  };

  const handleLightboxClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLightbox, selectedImage]);

  return (
    <div className="apartment-gallery">
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image}
              alt={`Apartment view ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {showLightbox && (
        <div className="lightbox" onClick={handleLightboxClick}>
          <button className="close" onClick={handleClose}>
            ×
          </button>
          <button className="prev" onClick={handlePrev}>
            ‹
          </button>
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="lightbox-image"
          />
          <button className="next" onClick={handleNext}>
            ›
          </button>
          <div className="lightbox-thumbnails">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${
                  image === selectedImage ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(image);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentGallery;
