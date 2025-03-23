import React from "react";
import { FaCalendarCheck } from "react-icons/fa";

export default function BookButton() {
  return (
    <a
      href="/appartement/plein/boeken"
      className="book-button button"
      aria-label="Direct boeken van het plein appartement"
      itemProp="url"
    >
      <FaCalendarCheck /> Direct Boeken
    </a>
  );
}
