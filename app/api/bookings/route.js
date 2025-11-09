import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    // Quick sanity check for required production env
    if (!process.env.SMOOBU_API_KEY) {
      return NextResponse.json(
        { error: "Missing SMOOBU_API_KEY on server" },
        { status: 500 }
      );
    }

    // Verplichte velden volgens Smoobu
    const requiredFields = [
      "arrivalDate",
      "departureDate",
      "apartmentId",
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Ontbrekende velden: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Smoobu API call
    const response = await axios.post(
      "https://login.smoobu.com/api/reservations",
      {
        ...body,
        channelId: 70, // Default channelId volgens documentatie
        language: "nl", // Standaard Nederlands
      },
      {
        headers: {
          "Api-Key": process.env.SMOOBU_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ id: response.data.id });
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.detail || "Boeking mislukt" },
      { status: error.response?.status || 500 }
    );
  }
}
