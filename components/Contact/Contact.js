import React from "react";
import "./Contact.scss";

const Contact = () => {
    return (
        <div className="contact-section content-section">
            <div className="map-wrapper">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12635.632325004444!2d2.9180284175773386!3d51.2058277983657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f2cb5d8760f7%3A0x8e89a90b537e8b53!2sParijsstraat%2022-28%2C%20Zeedijk%20116%20%28Middelkerke%29!5e0!3m2!1snl!2sbe!4v1677864778700!5m2!1snl!2sbe"
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
                            <p>
                            Parijsstraat 28 - Middelkerke
                            </p>
                        </div>
                    </div>
                    <div>
                        <h2>Stuur ons een bericht</h2>
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
                            <a href="mailto:hello@sanmarino4.be">hello@sanmarino4.be</a>
                        </p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
