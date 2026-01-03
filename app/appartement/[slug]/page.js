import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { generateSeo } from "/config/seo.config";
import SeoStructuredData from "@components/Seo/StructuredData";
import DynamicApartment from "./DynamicApartment";
import "./page.scss";

// Dynamic metadata
export async function generateMetadata({ params }) {
  const supabase = createServerClient();

  const { data: apartment } = await supabase
    .from("apartments")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!apartment) return {};

  return generateSeo({
    title: apartment.meta_title || `${apartment.name} | San Marino 4`,
    description: apartment.meta_description || apartment.description,
    openGraph: {
      images: apartment.og_image_url
        ? [
            {
              url: apartment.og_image_url,
              width: 1200,
              height: 630,
              alt: apartment.name,
            },
          ]
        : [],
    },
  });
}

export default async function ApartmentPage({ params }) {
  const supabase = createServerClient();

  // Haal appartement data op
  const { data: apartment, error } = await supabase
    .from("apartments")
    .select(
      `
      *,
      apartment_images (
        id,
        image_url,
        alt_text,
        display_order,
        is_primary
      ),
      reviews (
        id,
        author_name,
        rating,
        comment,
        stay_date,
        created_at
      )
    `
    )
    .eq("slug", params.slug)
    .eq("active", true)
    .single();

  if (error || !apartment) {
    notFound();
  }

  // Sorteer images
  apartment.apartment_images.sort((a, b) => a.display_order - b.display_order);

  // Filter en sorteer reviews
  const publishedReviews = apartment.reviews
    .filter((r) => r.published !== false)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Structured Data voor SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: apartment.name,
    description: apartment.description,
    image: apartment.apartment_images[0]?.image_url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Middelkerke",
      postalCode: "8430",
      addressCountry: "BE",
    },
    numberOfRooms: apartment.bedrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: apartment.max_guests,
    },
    priceRange: apartment.price_per_night
      ? `€${apartment.price_per_night}`
      : undefined,
  };

  return (
    <>
      <SeoStructuredData data={structuredData} />
      <DynamicApartment
        apartment={apartment}
        images={apartment.apartment_images}
        reviews={publishedReviews}
      />
    </>
  );
}

// Genereer static paths voor alle appartementen
export async function generateStaticParams() {
  const supabase = createServerClient();

  const { data: apartments } = await supabase
    .from("apartments")
    .select("slug")
    .eq("active", true);

  return (
    apartments?.map((apt) => ({
      slug: apt.slug,
    })) || []
  );
}
