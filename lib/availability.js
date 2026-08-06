// Client-side helper die /api/combined-availability dedupliceert. Op de
// boekingspagina vragen meerdere componenten (kalender, "volgend weekend",
// boekingsformulier) onafhankelijk van elkaar dezelfde data op bij het
// laden van de pagina — dit bundelt gelijktijdige aanvragen in één
// netwerkverzoek en cachet het resultaat kort, i.p.v. dat elk component
// zijn eigen fetch doet.
let inFlight = null;
let cache = null;
let cachedAt = 0;
const CACHE_TTL_MS = 30_000;

export function fetchCombinedAvailability() {
  const now = Date.now();
  if (cache && now - cachedAt < CACHE_TTL_MS) {
    return Promise.resolve(cache);
  }
  if (inFlight) return inFlight;

  inFlight = fetch("/api/combined-availability")
    .then((res) => res.json())
    .then((data) => {
      cache = data;
      cachedAt = Date.now();
      inFlight = null;
      return data;
    })
    .catch((err) => {
      inFlight = null;
      throw err;
    });

  return inFlight;
}
