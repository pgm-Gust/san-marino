# 📅 Geblokkeerde Datums Systeem - Samenvatting

## ✅ Wat is er toegevoegd?

### 1. **Database Schema** (Supabase)

📁 `supabase/schema.sql` (updated)

- Nieuwe `blocked_dates` tabel voor handmatig blokkeren van datums
- Relatie met `apartments` tabel via foreign key
- Validatie: einddatum moet na startdatum zijn
- Indexes voor snelle queries op datum bereiken
- Row Level Security (RLS) policies

### 2. **Backend API Endpoints**

#### 📁 `app/api/blocked-dates/route.js` (nieuw)

CRUD operaties voor geblokkeerde datums:

- `GET` - Haal geblokkeerde datums op (optioneel gefilterd op appartement/datum)
- `POST` - Voeg nieuwe blokkering toe
- `DELETE` - Verwijder blokkering
- `PATCH` - Update blokkering

#### 📁 `app/api/combined-availability/route.js` (updated)

Gecombineerde beschikbaarheid:

- Haalt externe iCal events op (Google + Airbnb)
- Haalt handmatig geblokkeerde datums uit Supabase
- Combineert alles in één response
- Markeert bron per event (iCal vs Manual)

#### 📁 `app/api/apartments/route.js` (nieuw)

- Haal lijst van alle appartementen op
- Filter op slug of ID

### 3. **Supabase Client Functies**

#### 📁 `lib/supabase/blocked-dates.js` (nieuw)

Helper functies voor database operaties:

- `fetchBlockedDates()` - Haal geblokkeerde datums op
- `addBlockedDate()` - Voeg blokkering toe
- `deleteBlockedDate()` - Verwijder blokkering
- `updateBlockedDate()` - Update blokkering
- `isDateRangeBlocked()` - Check of periode geblokkeerd is

#### 📁 `lib/supabase/apartments.js` (nieuw)

- `fetchApartments()` - Haal alle appartementen op
- `fetchApartmentBySlug()` - Zoek op slug
- `fetchApartmentById()` - Zoek op UUID

### 4. **Admin Interface**

#### 📁 `app/admin/blocked-dates/page.js` (nieuw)

Volledig beheerscherm voor geblokkeerde datums:

- Overzicht van alle blokkeringen in tabel
- Formulier om nieuwe blokkering toe te voegen
- Appartement selectie via dropdown
- Datum validatie (einddatum >= startdatum)
- Optionele reden toevoegen
- Verwijder functionaliteit

#### 📁 `app/admin/blocked-dates/BlockedDates.scss` (nieuw)

Moderne, responsive styling:

- Desktop layout met grid
- Mobiel-vriendelijk design
- Duidelijke visuele feedback
- Kleurgecodeerde knoppen

### 5. **Frontend Updates**

#### 📁 `components/AvailabilityCalendar/AvailabilityCalendar.js` (updated)

Kalender toont nu 3 statussen:

- **Groen** - Beschikbaar
- **Rood** - Bezet (via externe boeking)
- **Oranje** - Geblokkeerd (handmatig via Supabase)
- Tooltip met reden bij hover
- Onderscheid tussen bron in statustext

#### 📁 `components/AvailabilityCalendar/AvailabilityCalendar.scss` (updated)

Extra styling voor handmatige blokkeringen:

- Oranje kleurschema voor `.manual-block`
- Legenda met 3 kleuren
- Responsive aanpassingen

### 6. **Documentatie**

#### 📁 `BLOCKED_DATES_SETUP.md` (nieuw)

Volledige setup instructies met:

- Stapsgewijze database migratie
- API gebruik voorbeelden
- Veelgestelde vragen
- Toekomstige uitbreidingen
- Troubleshooting tips

---

## 🚀 Hoe te gebruiken?

### Stap 1: Database Setup

```sql
-- Voer uit in Supabase SQL Editor
-- Zie BLOCKED_DATES_SETUP.md voor volledige SQL
```

### Stap 2: Admin Interface

1. Ga naar `/admin/blocked-dates`
2. Klik "+ Nieuwe Blokkering"
3. Selecteer appartement, datums en reden
4. Klik "Blokkeren"

### Stap 3: Verifieer in Kalender

- Ga naar de publieke kalender
- Handmatig geblokkeerde datums zijn **oranje**
- Externe boekingen zijn **rood**
- Beschikbare dagen zijn **groen**

---

## 📊 Data Flow

```
┌─────────────────────────────────────────────┐
│         GEBRUIKER BLOKKEERT DATUM          │
│         (via /admin/blocked-dates)          │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│    POST /api/blocked-dates                  │
│    ├─ Validatie (datums, apartment_id)      │
│    └─ Opslaan in Supabase                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│    SUPABASE blocked_dates tabel             │
│    ├─ apartment_id (UUID)                   │
│    ├─ start_date                            │
│    ├─ end_date                              │
│    └─ reason                                │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  KALENDER haalt beschikbaarheid op          │
│  GET /api/combined-availability             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  COMBINEERT 3 BRONNEN:                      │
│  ├─ Google Calendar iCal                    │
│  ├─ Airbnb iCal                            │
│  └─ Supabase blocked_dates ← NIEUW!        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  TOONT IN KALENDER                          │
│  ├─ Groen: Beschikbaar                      │
│  ├─ Rood: Bezet (externe boeking)          │
│  └─ Oranje: Geblokkeerd (handmatig) ← NIEUW!│
└─────────────────────────────────────────────┘
```

---

## 🔒 Beveiliging

| Actie                  | Wie kan het?  | Via                                    |
| ---------------------- | ------------- | -------------------------------------- |
| Datums **bekijken**    | Iedereen      | Publieke kalender                      |
| Datums **blokkeren**   | Alleen admins | `/admin/blocked-dates` + authenticatie |
| Datums **verwijderen** | Alleen admins | Admin interface                        |
| API **lezen**          | Iedereen      | RLS policy: `SELECT` voor iedereen     |
| API **schrijven**      | Alleen admins | RLS policy: `ALL` voor authenticated   |

---

## 🎨 Visuele Voorbeelden

### Kalender Legenda

- 🟢 **Groen** = Beschikbaar
- 🔴 **Rood** = Bezet (Boeking via Airbnb/Google)
- 🟠 **Oranje** = Geblokkeerd (Handmatig via admin)

### Admin Interface Features

✅ Dropdown met echte appartement namen (uit database)  
✅ Datum validatie (eindatum >= startdatum)  
✅ Optionele reden field  
✅ Overzicht tabel met alle blokkeringen  
✅ Verwijder knop per blokkering  
✅ Responsive design (mobiel + desktop)

---

## 📝 Bestandsoverzicht

### Nieuwe Bestanden (8)

```
lib/supabase/
  ├─ blocked-dates.js          ← Database queries
  └─ apartments.js             ← Appartement queries

app/api/
  ├─ blocked-dates/
  │   └─ route.js              ← CRUD API
  └─ apartments/
      └─ route.js              ← Appartement API

app/admin/
  └─ blocked-dates/
      ├─ page.js               ← Admin interface
      └─ BlockedDates.scss     ← Styling

BLOCKED_DATES_SETUP.md         ← Setup instructies
```

### Gewijzigde Bestanden (4)

```
supabase/
  └─ schema.sql                ← + blocked_dates tabel

app/api/
  └─ combined-availability/
      └─ route.js              ← + Supabase integratie

components/AvailabilityCalendar/
  ├─ AvailabilityCalendar.js   ← + Oranje status
  └─ AvailabilityCalendar.scss ← + Oranje styling
```

---

## 🔮 Volgende Stappen

### Nu doen:

1. ✅ Voer database migratie uit (zie `BLOCKED_DATES_SETUP.md`)
2. ✅ Test via `/admin/blocked-dates`
3. ✅ Verifieer in publieke kalender

### Optionele uitbreidingen:

- [ ] Bulk import (CSV upload)
- [ ] Terugkerende blokkeringen (elke maandag)
- [ ] Email notificaties
- [ ] Export naar iCal
- [ ] Kleurcoderingen per reden
- [ ] Conflictdetectie met boekingen

---

## ❓ Veelgestelde Vragen

**Q: Werken externe kalenders nog?**  
A: Ja! Google en Airbnb iCal feeds worden nog steeds opgehaald en gecombineerd.

**Q: Kunnen gasten de reden zien?**  
A: Nee, alleen "Geblokkeerd" wordt getoond in de publieke kalender.

**Q: Wat bij overlappende blokkeringen?**  
A: De database staat het toe, de kalender toont alle periodes als bezet.

**Q: Hoe verwijder ik een blokkering?**  
A: Via `/admin/blocked-dates` → Klik "Verwijderen" bij de blokkering.

---

**Gemaakt:** 18 januari 2026  
**Versie:** 1.0  
**Status:** ✅ Klaar voor productie (na database migratie)
