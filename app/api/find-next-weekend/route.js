export async function GET() {
  if (!process.env.SMOOBU_API_KEY || !process.env.SMOOBU_CUSTOMER_ID) {
    console.error('Missing environment variables');
    return new Response(JSON.stringify({ 
      error: 'Server misconfiguration - contact beheerder' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let checkDate = new Date(today);

  try {
    for (let week = 0; week < 12; week++) {
      while (checkDate.getUTCDay() !== 5) {
        checkDate.setUTCDate(checkDate.getUTCDate() + 1);
      }

      const startDate = new Date(checkDate);
      const endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + 2);

      const formatUTC = (date) => date.toISOString().split('T')[0];
      const arrival = formatUTC(startDate);
      const departure = formatUTC(endDate);

      const response = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
        method: 'POST',
        headers: {
          'Api-Key': process.env.SMOOBU_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          arrivalDate: arrival,
          departureDate: departure,
          apartments: [Number(process.env.NEXT_PUBLIC_SMOOBU_APARTMENT_ID)],
          customerId: Number(process.env.SMOOBU_CUSTOMER_ID)
        })
      });

      if (!response.ok) throw new Error(`Smoobu error: ${response.status}`);
      
      const data = await response.json();
      
      if (data.availableApartments?.length > 0) {
        return new Response(JSON.stringify({
          available: true,
          weekend: `${arrival} - ${departure}`
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      checkDate.setUTCDate(checkDate.getUTCDate() + 7);
    }

    return new Response(JSON.stringify({
      available: false,
      message: "Geen vrij weekend gevonden in de komende 12 weken"
    }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Fout bij zoeken weekend:', error);
    return new Response(JSON.stringify({
      error: "Kon beschikbaarheid niet controleren",
      details: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
