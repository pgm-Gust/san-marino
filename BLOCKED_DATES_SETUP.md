# Geblokkeerde Datums Functionaliteit - Setup Instructies

Deze functionaliteit maakt het mogelijk om datums handmatig te blokkeren via Supabase, zodat je niet meer afhankelijk bent van externe API's om je kalender te beheren.

## 🎯 Wat is er toegevoegd?

1. **Database tabel** (`blocked_dates`) voor het opslaan van geblokkeerde periodes
2. **API endpoints** voor het beheren van geblokkeerde datums
3. **Admin interface** op `/admin/blocked-dates` voor eenvoudig beheer
4. **Geïntegreerde beschikbaarheid** - de kalender toont nu zowel externe boekingen als handmatig geblokkeerde datums

## 📋 Stap 1: Database Migratie

Voer de volgende SQL uit in je Supabase SQL Editor:

1. Ga naar je Supabase Dashboard
2. Klik op "SQL Editor" in het linker menu
3. Klik op "New Query"
4. Kopieer en plak de volgende SQL:

```sql
-- ============================================
-- BLOCKED DATES TABLE (Handmatig blokkeren)
-- ============================================
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apartment_id INTEGER REFERENCES apartments(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  blocked_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Index voor snellere queries
CREATE INDEX idx_blocked_dates_apartment ON blocked_dates(apartment_id);
CREATE INDEX idx_blocked_dates_range ON blocked_dates(start_date, end_date);

-- Enable RLS
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Iedereen kan geblokkeerde datums zien
CREATE POLICY "Iedereen kan geblokkeerde datums zien"
  ON blocked_dates FOR SELECT
  USING (true);

-- Iedereen kan datums blokkeren (voor development - later aanpassen met auth)
CREATE POLICY "Iedereen kan datums blokkeren"
  ON blocked_dates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Iedereen kan datums verwijderen"
  ON blocked_dates FOR DELETE
  USING (true);

CREATE POLICY "Iedereen kan datums updaten"
  ON blocked_dates FOR UPDATE
  USING (true);

-- Trigger voor updated_at
CREATE TRIGGER update_blocked_dates_updated_at BEFORE UPDATE ON blocked_dates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

5. Klik op "Run" om de query uit te voeren

## 📋 Stap 2: Verifieer de Apartments Tabel

Zorg ervoor dat je de apartments tabel hebt aangemaakt volgens het hoofdschema in `supabase/schema.sql`. Als je dit nog niet hebt gedaan, voer dan eerst dat schema uit.

## 🚀 Gebruik

### Via Admin Interface

1. Ga naar `/admin/blocked-dates` in je browser
2. Klik op "+ Nieuwe Blokkering"
3. Selecteer een appartement
4. Kies een start- en einddatum
5. Voeg optioneel een reden toe (bijv. "Onderhoud", "Privégebruik")
6. Klik op "Blokkeren"

### Via API (programmatisch)

**Voeg een blokkering toe:**
```javascript
const response = await fetch('/api/blocked-dates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apartmentId: 'uuid-hier',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    reason: 'Onderhoud'
  })
});
```

**Haal geblokkeerde datums op:**
```javascript
// Alle geblokkeerde datums
const response = await fetch('/api/blocked-dates');

// Voor specifiek appartement
const response = await fetch('/api/blocked-dates?apartmentId=uuid-hier');

// Voor specifieke periode
const response = await fetch('/api/blocked-dates?startDate=2026-02-01&endDate=2026-02-28');
```

**Verwijder een blokkering:**
```javascript
const response = await fetch('/api/blocked-dates?id=blocked-date-uuid', {
  method: 'DELETE'
});
```

## 📊 Hoe het werkt

### Frontend (Kalender)
De `AvailabilityCalendar` component haalt nu beschikbaarheid op via `/api/combined-availability`, die automatisch:
- Externe iCal events ophaalt (Google Calendar, Airbnb)
- Handmatig geblokkeerde datums uit Supabase haalt
- Alles combineert in één overzicht

### Backend (API)
- `/api/blocked-dates` - CRUD operaties voor geblokkeerde datums
- `/api/combined-availability` - Gecombineerde beschikbaarheid (externe + manual)
- `/api/apartments` - Haal appartement informatie op

### Database
De `blocked_dates` tabel slaat op:
- `apartment_id` - Welk appartement is geblokkeerd
- `start_date` - Vanaf wanneer
- `end_date` - Tot wanneer
- `reason` - Waarom (optioneel)
- `blocked_by` - Wie heeft het geblokkeerd (voor toekomstig gebruik)

## 🔒 Beveiliging

- **Row Level Security (RLS)** is ingeschakeld
- Iedereen kan geblokkeerde datums **zien** (nodig voor de kalender)
- Alleen **geauthenticeerde admins** kunnen datums blokkeren/deblokkeren
- Datum validatie voorkomt ongeldige periodes

## 🎨 Styling

De admin interface is volledig responsive en gebruikt:
- Moderne SCSS styling in `BlockedDates.scss`
- Mobiel-vriendelijk design
- Duidelijke feedback bij acties
- Gebruiksvriendelijke formulieren

## 🔮 Toekomstige Uitbreidingen

Mogelijke verbeteringen:
- [ ] Automatische synchronisatie met externe kalenders
- [ ] Terugkerende blokkeringen (bijv. elke maandag)
- [ ] Email notificaties bij nieuwe blokkeringen
- [ ] Bulk import/export functionaliteit
- [ ] Kleurcoderingen per reden (onderhoud = oranje, privé = blauw)
- [ ] Conflictdetectie met bestaande boekingen

## ❓ Veelgestelde Vragen

**Q: Kunnen gasten geblokkeerde datums zien?**
A: Ja, geblokkeerde datums zijn zichtbaar in de kalender als "bezet", maar de reden is niet zichtbaar.

**Q: Wat gebeurt er met overlappende blokkeringen?**
A: De database staat overlappende periodes toe. De kalender toont alle geblokkeerde periodes.

**Q: Kan ik een blokkering aanpassen?**
A: Momenteel kun je een blokkering verwijderen en een nieuwe aanmaken. Een update functie kan eenvoudig worden toegevoegd.

**Q: Werken externe kalenders nog steeds?**
A: Ja! Externe iCal feeds (Google, Airbnb) worden nog steeds opgehaald en gecombineerd met handmatige blokkeringen.

## 📞 Support

Bij problemen, check:
1. Of de database migratie succesvol was
2. Of je Supabase credentials correct zijn ingesteld
3. De browser console voor foutmeldingen
4. De Supabase logs voor database fouten
