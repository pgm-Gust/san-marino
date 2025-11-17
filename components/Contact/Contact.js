import React from "react";

const Contact = () => {
    return (
        <div className="contactt-section">
            <div className="map-wrapper">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2526.7551139743687!2d2.8116398766308106!3d51.18763977174239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dca45561b94187%3A0x9f5e700630a34b27!2sParijsstraat%2028%2C%208430%20Middelkerke!5e1!3m2!1snl!2sbe!4v1763409110781!5m2!1snl!2sbe"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
            <div className="text-content">
                <p className="subheading">Contact</p>
                <h2>Contacteer Ons</h2>
                <div className="contact-details">
                    <div className="detail">
                        <div className="">
                            <img src="assets/icons/Map_Pin.svg" alt="Map Pin" />
                        </div>
                        <div>
                            <h3>Adres</h3>
                            <p>
                            Parijsstraat 28 / 402 - Middelkerke
                            </p>
                        </div>
                    </div>
                    <div>
                        <h2>Stuur ons een bericht!</h2>
                    </div>
                    <div className="detail">
                        <div className="">
                            <img src="assets/icons/Phone.svg" alt="Phone" />
                        </div>
                        <div>
                            <p>
                            +324 74 98 40 81
                            </p>
                        </div>
                    </div>
                    <div className="detail">
                    <div className="">
                        <img src="assets/icons/Mail.svg" alt="Mail" />
                    </div>
                    <div>
                        <p>
                            <a href="mailto:sofieramon@telenet.be">sofieramon@telenet.be</a>
                        </p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
