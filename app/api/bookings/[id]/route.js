import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const smoobuResponse = await axios.get(
      `https://login.smoobu.com/api/reservations/${id}`,
      {
        headers: { 'Api-Key': process.env.SMOOBU_API_KEY },
      }
    );

    const reservation = smoobuResponse.data;

    console.log('Full Smoobu response:', JSON.stringify(reservation, null, 2));

    const checkInDate = new Date(reservation.arrival);
    const checkOutDate = new Date(reservation.departure);

    const responseData = {
      id: reservation.id,
      arrivalDate: reservation.arrival,
      departureDate: reservation.departure,
      apartment: reservation.apartment?.name || 'Onbekend appartement',
      guest: {
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        email: reservation.email,
        phone: reservation.phone
      },
      address: {
        street: reservation.street || reservation.address?.street,
        postalCode: reservation.zip || reservation.address?.zip,
        location: reservation.city || reservation.address?.city,
        country: reservation.country || reservation.address?.country
      },
      adults: reservation.adults || 2,
      children: reservation.children || 0,
      arrivalTime: reservation.arrivalTime || reservation['check-in']?.time,
      departureTime: reservation.departureTime || reservation['check-out']?.time,
      notice: reservation.note,
      pricePerNight: parseFloat(reservation.pricePerNight) || 0,
      totalPrice: parseFloat(reservation.totalPrice) || 0,
      nights: Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    };

    console.log('Processed data:', responseData);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Fout bij ophalen booking:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Boekinggegevens konden niet opgehaald worden' },
      { status: 500 }
    );
  }
}