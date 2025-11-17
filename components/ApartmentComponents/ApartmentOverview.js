import React from "react";
import ApartmentGallery from "@components/AppartmentGallery/AppartmentGallery";

export default function ApartmentOverview() {
  return (
    <>
      <p className="subheading">Luxe vakantieverblijf</p>
      <h1 itemProp="name">Studio met zicht op zee en plein</h1>
      <ApartmentGallery
        itemProp="image"
        aria-label="Foto's van het plein studio"
      />
    </>
  );
}
