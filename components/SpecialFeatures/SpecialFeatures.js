import React from "react";

const SpecialFeatures = () => {
    return (
        <div className="container">
            <div className="images">
                <img
                    src="assets/images/strandavond.jpg"
                    alt="Strandstad"
                    className="image small"
                />
                <img
                    src="assets/images/zonsondergang.png"
                    alt="Zonsondergang"
                    className="image large"
                />
            </div>
            <div className="text-content">
                <p className="subheading">Troeven</p>
                <h2>Wat maakt ons uniek?</h2>
                <div className="features">
                    <div className="feature">
                        <div className="icon">
                        <img src="assets/icons/Comfort.svg" alt="Comfort" />
                        </div>
                        <div>
                            <h3>Alles voor jouw comfort</h3>
                            <p>
                                We zorgen ervoor dat je niets tekortkomt tijdens je verblijf. Of
                                je nu ontspant of even moet werken, alles is binnen handbereik.
                            </p>
                        </div>
                    </div>
                    <div className="feature">
                        <div className="icon">
                            <img src="assets/icons/Frame.svg" alt="View" />
                        </div>
                        <div>
                            <h3>Uitzicht waar je naar kan blijven kijken</h3>
                            <p>
                                Elke ochtend word je wakker met een adembenemend uitzicht op de
                                zee en de dijk. Perfect om te ontspannen en tot rust te komen.
                            </p>
                        </div>
                    </div>
                    <div className="feature">
                        <div className="icon">
                            <img src="assets/icons/Oppurtunities.svg" alt="Oppurtunities" />
                        </div>
                        <div>
                            <h3>Tal van activiteiten</h3>
                            <p>
                                Van ontspannende strandwandelingen tot avontuurlijke
                                fietstochten - ontdek de omgeving of geniet gewoon van de rust.
                                Er is voor iedereen wat wils.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialFeatures;
