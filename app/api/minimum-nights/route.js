import { NextResponse } from "next/server";
import {
  fetchMinimumNights,
  addMinimumNight,
  deleteMinimumNight,
  updateMinimumNight,
  getMinimumNightsForDate,
} from "@/lib/supabase/minimum-nights";

// GET - Haal minimum nights op
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apartmentId = searchParams.get("apartmentId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const arrivalDate = searchParams.get("arrivalDate");

    // Als arrivalDate is gegeven, geef het minimum voor die specifieke datum
    if (arrivalDate && apartmentId) {
      const minNight = await getMinimumNightsForDate(apartmentId, arrivalDate);
      return NextResponse.json({ minNight });
    }

    const minimumNights = await fetchMinimumNights(apartmentId, startDate, endDate);
    return NextResponse.json({ minimumNights });
  } catch (error) {
    console.error("Error fetching minimum nights:", error);
    return NextResponse.json(
      { error: "Kon minimum nights niet ophalen" },
      { status: 500 }
    );
  }
}

// POST - Voeg nieuwe minimum nights regel toe
export async function POST(request) {
  try {
    const body = await request.json();
    const { apartmentId, startDate, endDate, minNights, reason } = body;

    if (!apartmentId || !startDate || !endDate || !minNights) {
      return NextResponse.json(
        { error: "apartmentId, startDate, endDate en minNights zijn verplicht" },
        { status: 400 }
      );
    }

    if (minNights < 1) {
      return NextResponse.json(
        { error: "Minimum nachten moet minimaal 1 zijn" },
        { status: 400 }
      );
    }

    const minNight = await addMinimumNight(apartmentId, startDate, endDate, minNights, reason);
    return NextResponse.json({ minNight }, { status: 201 });
  } catch (error) {
    console.error("Error adding minimum night:", error);
    return NextResponse.json(
      { error: "Kon minimum night regel niet toevoegen" },
      { status: 500 }
    );
  }
}

// DELETE - Verwijder minimum nights regel
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is verplicht" },
        { status: 400 }
      );
    }

    await deleteMinimumNight(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting minimum night:", error);
    return NextResponse.json(
      { error: "Kon minimum night regel niet verwijderen" },
      { status: 500 }
    );
  }
}

// PATCH - Update minimum nights regel
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is verplicht" },
        { status: 400 }
      );
    }

    const minNight = await updateMinimumNight(id, updates);
    return NextResponse.json({ minNight });
  } catch (error) {
    console.error("Error updating minimum night:", error);
    return NextResponse.json(
      { error: "Kon minimum night regel niet updaten" },
      { status: 500 }
    );
  }
}
