export async function POST(request) {
  const { arrivalDate, departureDate } = await request.json();

  try {
    const response = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.SMOOBU_API_KEY,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        arrivalDate,
        departureDate,
        apartments: [Number(process.env.NEXT_PUBLIC_SMOOBU_APARTMENT_ID)],
        customerId: Number(process.env.SMOOBU_CUSTOMER_ID)
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'API request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}