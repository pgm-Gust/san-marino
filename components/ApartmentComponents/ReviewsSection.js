import React from "react";
import { FaStar } from "react-icons/fa";

export default function ReviewsSection() {
  const reviews = [
    {
      rating: 5,
      text: `"Elke ochtend wakker worden met het ruisen van de zee... Dit appartement geeft je het echte 'aan-zijn-van-de-kust'-gevoel. Onze kinderen hebben uren op het strand gespeeld dat letterlijk voor de deur ligt!"`,
      author: "Jasper, augustus 2024",
    },
    {
      rating: 5,
      text: `"De zonsondergangen vanaf het balkon zijn magisch! 's Avonds vielen we in slaap met het geluid van kabbelende golven. Perfecte locatie om de zee te proeven en alle voorzieningen binnen handbereik."`,
      author: "Gust, september 2024",
    },
  ];

  return (
    <div className="info-section reviews">
      <h2>
        <FaStar /> Reviews
      </h2>
      <div className="grid-container review-carousel">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="review"
            itemScope
            itemType="https://schema.org/Review"
          >
            <div
              className="rating"
              itemProp="reviewRating"
              itemScope
              itemType="https://schema.org/Rating"
            >
              <meta itemProp="ratingValue" content="5" />
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} aria-hidden="true" />
              ))}
            </div>
            <p itemProp="reviewBody">{review.text}</p>
            <div className="review-author seaside-theme" itemProp="author">
              {review.author}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
