'use client';

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import "./ApartmentGallery.css";

const photos = [
    "assets/images/plein/Parijsstraat280402Middelkerke07.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke08.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke09.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke06.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke10.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke11.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke12.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke13.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke14.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke15.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke16.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke17.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke18.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke19.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke20.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke21.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke22.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke23.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke24.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke25.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke26.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke27.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke28.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke29.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke30.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke31.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke32.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke05.jpg",
    "assets/images/plein/Detail01.jpg",
    "assets/images/plein/Detail02.jpg",
    "assets/images/plein/Detail03.jpg",
    "assets/images/plein/Detail04.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke01.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke02.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke03.jpg",
    "assets/images/plein/Parijsstraat280402Middelkerke04.jpg",
];

export default function ApartmentGallery() {
    const [currentIndex, setCurrentIndex] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    useEffect(() => {
        if (lightboxOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [lightboxOpen]);

    const openPhoto = (index) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const closePhoto = () => {
        setLightboxOpen(false);
        setCurrentIndex(null);
    };

    const showNext = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const showPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const getThumbnailRange = () => {
        const thumbCount = 5;
        if (currentIndex === null || photos.length === 0) return { start: 0, end: 0 };

        let start = currentIndex - Math.floor(thumbCount / 2);
        let end = start + thumbCount - 1;

        if (start < 0) {
            start = 0;
            end = Math.min(photos.length - 1, thumbCount - 1);
        }

        if (end >= photos.length) {
            end = photos.length - 1;
            start = Math.max(0, end - thumbCount + 1);
        }

        return { start, end };
    };

    const { start, end } = getThumbnailRange();

    return (
        <div className="gallery-container">
            <div className="gallery-grid">
                <img
                    src={photos[0]}
                    alt="Main"
                    className="gallery-main"
                    onClick={() => openPhoto(0)}
                />
                <div className="gallery-column">
                    <img
                        src={photos[1]}
                        alt="Side 1"
                        className="gallery-side"
                        onClick={() => openPhoto(1)}
                    />
                    <img
                        src={photos[2]}
                        alt="Side 2"
                        className="gallery-side"
                        onClick={() => openPhoto(2)}
                    />
                </div>
            </div>

            <div className="gallery-row">
                {photos.slice(3, 8).map((photo, index) => (
                    <img
                        key={index + 3}
                        src={photo}
                        alt={`Thumbnail ${index + 3}`}
                        className="gallery-thumb"
                        onClick={() => openPhoto(index + 3)}
                    />
                ))}
                <div className="gallery-more" onClick={() => openPhoto(8)}>
                    + {photos.length - 8} foto's
                </div>
            </div>

            {lightboxOpen && (
                <div className="lightbox">
                    <span className="close" onClick={closePhoto}>
                        <FaTimes />
                    </span>
                    <span className="prev" onClick={showPrev}>
                        <FaArrowLeft />
                    </span>
                    <img
                        src={photos[currentIndex]}
                        alt="Selected"
                        className="lightbox-image"
                    />
                    <span className="next" onClick={showNext}>
                        <FaArrowRight />
                    </span>

                    <div className="lightbox-thumbnails">
                        {photos.slice(start, end + 1).map((photo, index) => {
                            const photoIndex = start + index;
                            return (
                                <img
                                    key={photoIndex}
                                    src={photo}
                                    alt=""
                                    className={`thumbnail ${
                                        currentIndex === photoIndex ? "active" : ""
                                    }`}
                                    onClick={() => setCurrentIndex(photoIndex)}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
