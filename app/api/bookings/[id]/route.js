import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log('Probeer booking op te halen:', id);
    
    const smoobuResponse = await axios.get(
      `https://login.smoobu.com/api/reservations/${id}`,
      {
        headers: {
          'Api-Key': process.env.SMOOBU_API_KEY,
        },
      }
    );

    console.log('Smoobu response:', smoobuResponse.data);

    return NextResponse.json({
      id: smoobuResponse.data.id,
      arrivalDate: smoobuResponse.data.arrival,
      departureDate: smoobuResponse.data.departure,
      apartment: smoobuResponse.data.apartment?.name || 'Onbekend appartement',
      guest: `${smoobuResponse.data.firstName} ${smoobuResponse.data.lastName}`,
      status: smoobuResponse.data.status,
      price: smoobuResponse.data.totalPrice
    });

  } catch (error) {
    console.error('Fout bij ophalen booking:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: error.response?.data?.detail || 'Boeking niet gevonden',
        smoobuError: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}