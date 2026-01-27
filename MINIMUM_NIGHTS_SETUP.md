# Minimum Nachten Systeem - Setup Instructies

Met dit systeem kun je minimum verblijfsduur instellen per periode via Supabase.

## 📋 Stap 1: Database Migratie

Voer de SQL uit in je Supabase SQL Editor:

1. Open Supabase Dashboard → SQL Editor
2. Kopieer de inhoud van `database/minimum_nights_schema.sql`
3. Voer de query uit

## 🚀 Gebruik

### Via Admin Interface

1. Ga naar `/admin/minimum-nights`
2. Klik op "+ Nieuwe Regel"
3. Vul in:
   - **Startdatum**: Begin van de periode
   - **Einddatum**: Eind van de periode
   - **Minimum nachten**: Bijv. 7 voor zomervakantie
   - **Reden**: Optioneel, bijv. "Zomervakantie"
4. Klik op "Opslaan"

### Voorbeelden

**Zomervakantie (7 nachten minimum):**

- Start: 01-07-2026
- Eind: 31-08-2026
- Min nachten: 7
- Reden: Zomervakantie

**Weekend regeling (2 nachten minimum):**

- Start: 01-01-2026
- Eind: 30-06-2026
- Min nachten: 2
- Reden: Standaard periode

## 📊 Hoe het werkt

### Frontend (BookingForm)

- Controleert automatisch het minimum aantal nachten voor de gekozen aankomstdatum
- Toont foutmelding als te weinig nachten worden geboekt
- Blokkeert verzenden van het formulier

### Backend (API)

- `/api/minimum-nights` - CRUD operaties voor regels
- Query parameter `?arrivalDate=2026-07-15&apartmentId=1` geeft minimum voor die datum

### Database

De `minimum_nights` tabel slaat op:

- `apartment_id` - Voor welk appartement
- `start_date` - Begin van de periode
- `end_date` - Eind van de periode
- `min_nights` - Minimum aantal nachten
- `reason` - Waarom deze regel (optioneel)

## 🎯 Voorrang bij overlappende regels

Als meerdere regels van toepassing zijn, geldt de **hoogste** waarde.

Bijvoorbeeld:

- Regel 1: 01-06 t/m 31-08, min 3 nachten
- Regel 2: 01-07 t/m 15-07, min 7 nachten

Op 10 juli geldt: **7 nachten** (hoogste waarde)

## ⚙️ Integratie met Boekingsformulier

Het systeem is automatisch geïntegreerd. Gasten zien een melding als ze te weinig nachten proberen te boeken:

> ⚠️ Voor deze periode is een minimum verblijf van 7 nachten vereist.

## 🔒 Standaardwaarde

Zonder regel is het minimum **1 nacht**.

## 💡 Tips

- Stel lange periodes in met lage minimums (bijv. heel jaar, 2 nachten)
- Voeg specifieke periodes toe met hogere minimums (bijv. zomer, 7 nachten)
- Gebruik duidelijke redenen zodat je later weet waarom een regel bestaat
- Update de tabel elk jaar voor nieuwe seizoenen

## 🗑️ Verwijderen

Klik op "Verwijderen" naast een regel om deze te wissen. De regel verdwijnt direct en gasten kunnen weer kortere verblijven boeken in die periode.
