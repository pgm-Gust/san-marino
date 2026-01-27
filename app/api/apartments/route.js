import { NextResponse } from "next/server";
import { fetchApartments, fetchApartmentBySlug, fetchApartmentById } from "@/lib/supabase/apartments";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (slug) {
      const apartment = await fetchApartmentBySlug(slug);
      return NextResponse.json({ apartment });
    }

    if (id) {
      const apartment = await fetchApartmentById(id);
      return NextResponse.json({ apartment });
    }

    const apartments = await fetchApartments();
    return NextResponse.json({ apartments });
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return NextResponse.json(
      { error: "Kon appartementen niet ophalen" },
      { status: 500 }
    );
  }
}
