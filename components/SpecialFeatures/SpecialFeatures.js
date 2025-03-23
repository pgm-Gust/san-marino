import React from "react";

const SpecialFeatures = () => {
    return (
        <div className="content-section">
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
                <h2>Waarom kiezen voor ons?</h2>
                <div className="features">
                    <div className="feature">
                        <div className="icon">
                        <img src="assets/icons/Comfort.svg" alt="Comfort" />
                        </div>
                        <div>
                            <h3>Geniet van rust en gemak</h3>
                            <p>
                            Ontspan in een perfect gelegen appartement met alle faciliteiten binnen handbereik.  
                            Van een vlotte check-in tot een zorgeloos verblijf – comfort staat bij ons centraal.
                            </p>
                        </div>
                    </div>
                    <div className="feature">
                        <div className="icon">
                            <img src="assets/icons/Frame.svg" alt="Uitzicht" />
                        </div>
                        <div>
                            <h3>Adembenemend uitzicht</h3>
                            <p>
                            Rechtstreeks zicht op de zee vanaf het balkon. Wordt wakker 
                                met de golven als achtergrondgeluid en geniet van unieke 
                                zonsondergangen die elke avond anders zijn.
                            </p>
                        </div>
                    </div>
                    <div className="feature">
                        <div className="icon">
                            <img src="assets/icons/Oppurtunities.svg" alt="Ligging" />
                        </div>
                        <div>
                            <h3>Ideale ligging</h3>
                            <p>
                            Centraal tussen strand en dorpskern. Op 50 meter van het strand 
                                en toch vlakbij alle voorzieningen. De perfecte locatie voor 
                                zowel actieve uitstappen als totale ontspanning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialFeatures;
