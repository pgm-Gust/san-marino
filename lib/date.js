// Gedeelde helpers voor "YYYY-MM-DD"-datumstrings zoals die overal in de
// boekingsflow gebruikt worden (kalender, prijzen, beschikbaarheid). Gebruik
// deze i.p.v. steeds opnieuw new Date(dateStr) + lokale getDate/setDate te
// combineren — dat mixen van UTC-parsing met lokale datummethodes was de
// bron van een DST-gerelateerde bug in de prijsberekening.
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
