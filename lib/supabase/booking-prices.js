import { fetchPleinPrices } from "@/lib/supabase/plein-prices";

/**
 * Haal een array van prijzen op voor een periode (inclusief start, exclusief end).
 * Geeft een array van prijzen per nacht, in volgorde.
 * Als er geen prijs is ingesteld voor een dag, wordt fallbackPrice gebruikt.
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @param {number} fallbackPrice - prijs als er geen specifieke prijs is
 * @returns {Promise<number[]>}
 */
export async function getBookingPrices(
  startDate,
  endDate,
  fallbackPrice = 200
) {
  // Haal prijzen uit Supabase
  const prijzen = await fetchPleinPrices(startDate, endDate);
  // Maak een map van date -> prijs
  const prijsMap = Object.fromEntries(prijzen.map((p) => [p.date, p.price]));
  // Genereer alle datums tussen start en end (exclusief end)
  const prices = [];
  let d = new Date(startDate);
  const end = new Date(endDate);
  while (d < end) {
    const dateStr = d.toISOString().slice(0, 10);
    prices.push(
      prijsMap[dateStr] !== undefined ? prijsMap[dateStr] : fallbackPrice
    );
    d.setDate(d.getDate() + 1);
  }
  return prices;
}
