import { NextResponse } from "next/server";
import {
  fetchBlockedDates,
  addBlockedDate,
  deleteBlockedDate,
  updateBlockedDate,
} from "@/lib/supabase/blocked-dates";

// GET - Haal geblokkeerde datums op
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apartmentId = searchParams.get("apartmentId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const blockedDates = await fetchBlockedDates(apartmentId, startDate, endDate);

    return NextResponse.json({ blockedDates });
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return NextResponse.json(
      { error: "Kon geblokkeerde datums niet ophalen" },
      { status: 500 }
    );
  }
}

// POST - Voeg nieuwe geblokkeerde periode toe
export async function POST(request) {
  try {
    const body = await request.json();
    const { apartmentId, startDate, endDate, reason } = body;

    if (!apartmentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "apartmentId, startDate en endDate zijn verplicht" },
        { status: 400 }
      );
    }

    // Validatie: controleer of datums geldig zijn
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Ongeldige datum formaat" },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { error: "Einddatum moet na startdatum zijn" },
        { status: 400 }
      );
    }

    const blockedDate = await addBlockedDate(apartmentId, startDate, endDate, reason);

    return NextResponse.json({ blockedDate }, { status: 201 });
  } catch (error) {
    console.error("Error adding blocked date:", error);
    return NextResponse.json(
      { error: "Kon datum niet blokkeren" },
      { status: 500 }
    );
  }
}

// DELETE - Verwijder geblokkeerde periode
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

    await deleteBlockedDate(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blocked date:", error);
    return NextResponse.json(
      { error: "Kon blokkering niet verwijderen" },
      { status: 500 }
    );
  }
}

// PATCH - Update geblokkeerde periode
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

    const blockedDate = await updateBlockedDate(id, updates);

    return NextResponse.json({ blockedDate });
  } catch (error) {
    console.error("Error updating blocked date:", error);
    return NextResponse.json(
      { error: "Kon blokkering niet updaten" },
      { status: 500 }
    );
  }
}
