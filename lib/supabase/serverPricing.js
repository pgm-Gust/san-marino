import { supabaseService } from "./serviceClient";

// Server-only, authoritatieve prijsberekening voor de boekingsflow. Spiegelt
// de logica van lib/supabase/booking-prices.js (client-side, enkel voor UX),
// maar leest met de service_role key zodat een gast de prijs niet kan
// beïnvloeden door een ander bedrag mee te sturen in het boekingsformulier.
const CLEANING_FEE = 80;
const FALLBACK_PRICE = 200;

export async function calculateServerBookingPrice(
  apartmentId,
  startDate,
  endDate
) {
  const { data, error } = await supabaseService
    .from("apartment_prices")
    .select("date, price")
    .eq("apartment_id", apartmentId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);

  const priceMap = Object.fromEntries(
    (data || []).map((p) => [p.date, p.price])
  );

  const nightlyPrices = [];
  let d = new Date(startDate);
  const end = new Date(endDate);
  while (d < end) {
    const dateStr = d.toISOString().slice(0, 10);
    nightlyPrices.push(
      priceMap[dateStr] !== undefined ? priceMap[dateStr] : FALLBACK_PRICE
    );
    d.setDate(d.getDate() + 1);
  }

  const nightsTotal = nightlyPrices.reduce((sum, p) => sum + p, 0);
  const pricePerNight =
    nightlyPrices.length > 0
      ? Math.round(nightsTotal / nightlyPrices.length)
      : FALLBACK_PRICE;

  return {
    pricePerNight,
    totalPrice: nightsTotal + CLEANING_FEE,
    cleaningFee: CLEANING_FEE,
    nightlyPrices,
  };
}
