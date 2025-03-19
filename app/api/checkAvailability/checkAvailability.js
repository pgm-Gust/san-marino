export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { arrivalDate, departureDate } = req.body;

  try {
    const response = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.SMOOBU_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        arrivalDate,
        departureDate,
        apartments: [process.env.NEXT_PUBLIC_SMOOBU_APARTMENT_ID],
        customerId: process.env.SMOOBU_CUSTOMER_ID
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}