"use client";

import { useState, useEffect } from "react";
import { FaArrowRight, FaExpand, FaArrowLeft } from "react-icons/fa";
import "./ApartmentSlider.scss";

const apartments = [
    {
        id: 1,
        title: "Plein Appartement",
        images: [
            "/assets/images/plein/Parijsstraat280402Middelkerke12.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke10.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke14.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke20.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke06.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke10.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke11.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke13.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke15.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke16.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke17.jpg",
            "/assets/images/plein/Parijsstraat280402Middelkerke18.jpg",
        ],
        link: "/appartement/plein"
    }
];

const ApartmentSlider = () => {
    const [currentIndices, setCurrentIndices] = useState({ 1: 0 });
    const [activeApartment, setActiveApartment] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleSlide = (apartmentId, direction) => {
        const apartment = apartments.find(a => a.id === apartmentId);
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndices(prev => ({
                ...prev,
                [apartmentId]: direction === 'next' 
                    ? (prev[apartmentId] + 1) % apartment.images.length
                    : (prev[apartmentId] > 0 ? prev[apartmentId] - 1 : apartment.images.length - 1)
            }));
            setIsTransitioning(false);
        }, 300);
    };

    const openLightbox = (apartmentId, index) => {
        setActiveApartment(apartmentId);
        setCurrentIndices(prev => ({ ...prev, [apartmentId]: index }));
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setActiveApartment(null);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isLightboxOpen && activeApartment) {
                switch(e.key) {
                    case 'ArrowRight':
                        handleSlide(activeApartment, 'next');
                        break;
                    case 'ArrowLeft':
                        handleSlide(activeApartment, 'prev');
                        break;
                    case 'Escape':
                        closeLightbox();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, activeApartment, currentIndices]);

    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isLightboxOpen]);

    return (
        <div className="apartments-grid">
            {apartments.map(apartment => (
                <div key={apartment.id} className="apartment-card">
                    <div className="slider-container">
                        <div className="slider">
                            <button 
                                className="arrow left" 
                                onClick={() => handleSlide(apartment.id, 'prev')}
                            >
                                <FaArrowLeft />
                            </button>
                            
                            <div className="image-wrapper">
                                <img
                                    src={apartment.images[currentIndices[apartment.id]]}
                                    alt={apartment.title}
                                    onClick={() => openLightbox(apartment.id, currentIndices[apartment.id])}
                                    className="main-image"
                                />
                            </div>
                            
                            <button
                                className="arrow right"
                                onClick={() => handleSlide(apartment.id, 'next')}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>

                    <div className="thumbnails">
                        {apartment.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className={`thumbnail ${index === currentIndices[apartment.id] ? 'active' : ''}`}
                                onClick={() => {
                                    setCurrentIndices(prev => ({ ...prev, [apartment.id]: index }));
                                }}
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
                <div className="lightbox">
                    <button className="close-btn" onClick={closeLightbox}>&times;</button>
                    <div className="lightbox-content">
                        <button 
                            className="lightbox-arrow left"
                            onClick={() => handleSlide(activeApartment, 'prev')}
                        >
                            <FaArrowLeft />
                        </button>
                        
                        <img
                            src={apartments.find(a => a.id === activeApartment).images[currentIndices[activeApartment]]}
                            alt="Appartement"
                            className="lightbox-image"
                        />
                        
                        <button 
                            className="lightbox-arrow right"
                            onClick={() => handleSlide(activeApartment, 'next')}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                    
                    <div className="lightbox-thumbnails">
                        {apartments.find(a => a.id === activeApartment).images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className={`thumbnail ${index === currentIndices[activeApartment] ? 'active' : ''}`}
                                onClick={() => {
                                    setCurrentIndices(prev => ({ ...prev, [activeApartment]: index }));
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApartmentSlider;