# 🚀 Supabase CMS Setup Instructies

## Wat is er geïnstalleerd?

Je hebt nu een volledig werkend Content Management System (CMS) voor je appartement website! 🎉

## 📋 Setup Stappen (volg deze in volgorde)

### 1. Maak een Supabase Account aan

1. Ga naar [https://supabase.com](https://supabase.com)
2. Klik op "Start your project"
3. Log in met GitHub of maak een account aan (gratis!)

### 2. Maak een Nieuw Project aan

1. Klik op "New Project"
2. Geef je project een naam: bijv. `san-marino-cms`
3. Kies een sterk **Database Password** (bewaar deze goed!)
4. Selecteer regio: **West EU (Ireland)** (snelst voor België)
5. Klik op "Create new project"
6. Wacht 1-2 minuten tot het project klaar is

### 3. Kopieer je API Keys

1. Ga naar **Project Settings** (tandwiel icoon links)
2. Klik op **API** in het menu
3. Je ziet nu:

   - `Project URL`
   - `anon public` key
   - `service_role` key (klik op "Reveal" om te zien)

4. Open het bestand `.env.local` in je project
5. Vervang de volgende waarden:

```env
NEXT_PUBLIC_SUPABASE_URL=je-project-url-hier
NEXT_PUBLIC_SUPABASE_ANON_KEY=je-anon-key-hier
SUPABASE_SERVICE_ROLE_KEY=je-service-role-key-hier
```

### 4. Maak de Database Structuur aan

1. Ga in Supabase naar **SQL Editor** (links in menu)
2. Klik op **New Query**
3. Open het bestand `supabase/schema.sql` in je project
4. **Kopieer ALLES** uit dat bestand
5. Plak het in de SQL Editor in Supabase
6. Klik rechtsonder op **Run** ▶️
7. Je krijgt een succesbericht te zien!

### 5. Maak een Storage Bucket aan (voor foto's)

1. Ga naar **Storage** in het linker menu
2. Klik op **New Bucket**
3. Naam: `apartment-images`
4. **Zet "Public bucket" AAN** ✅
5. Klik op "Create bucket"

6. Klik op de nieuwe bucket `apartment-images`
7. Ga naar **Policies** tab
8. Klik op **New Policy** en selecteer "For full customization"
9. Maak 3 policies aan:

**Policy 1: SELECT (bekijken)**

```sql
CREATE POLICY "Iedereen kan images bekijken"
ON storage.objects FOR SELECT
USING (bucket_id = 'apartment-images');
```

**Policy 2: INSERT (uploaden)**

```sql
CREATE POLICY "Admins kunnen images uploaden"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'apartment-images' AND auth.role() = 'authenticated');
```

**Policy 3: DELETE (verwijderen)**

```sql
CREATE POLICY "Admins kunnen images verwijderen"
ON storage.objects FOR DELETE
USING (bucket_id = 'apartment-images' AND auth.role() = 'authenticated');
```

### 6. Maak een Admin User aan

1. Ga naar **Authentication** > **Users**
2. Klik op **Add user** > **Create new user**
3. Email: `jouw-email@example.com`
4. Password: Kies een sterk wachtwoord
5. ✅ **Auto Confirm User** AAN zetten!
6. Klik op **Create user**

### 7. Test je Admin Dashboard

1. Start je Next.js development server:

```bash
npm run dev
```

2. Ga naar: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

3. Log in met het email en wachtwoord van stap 6

4. Je komt nu op het Admin Dashboard! 🎉

## 🎨 Hoe te gebruiken

### Appartementen Beheren

- Ga naar **Dashboard** > **Appartementen Beheren**
- Je ziet de 2 voorbeeld appartementen (Plein & Hoek)
- Klik op **Foto's** om foto's te uploaden

### Foto's Uploaden

1. Klik op een appartement > **Foto's**
2. Sleep een foto in het upload vak (of klik om te selecteren)
3. Klik op **Foto Uploaden**
4. Klaar! De foto is nu zichtbaar op de website

### Foto's Beheren

- **Volgorde wijzigen**: Gebruik de ↑ ↓ knoppen
- **Hoofdfoto instellen**: Klik op de ⭐ knop
- **Foto verwijderen**: Klik op de 🗑️ knop

### Dynamische Pagina's

Je oude statische pagina's zijn vervangen door dynamische:

- `/appartement/plein` → Haalt data uit database
- `/appartement/hoek` → Haalt data uit database
- Alle foto's komen automatisch van Supabase Storage

## 🔧 Wijzigingen aan Appartementen

Om appartement gegevens te wijzigen (naam, prijs, voorzieningen):

1. Ga naar Supabase Dashboard
2. **Table Editor** > **apartments**
3. Klik op de rij die je wilt wijzigen
4. Wijzig de velden
5. Klik op **Save**

**Let op**: Een volledige edit interface komt binnenkort!

## 📱 Wat kan je klant nu?

Via het `/admin` dashboard kan je klant:

- ✅ Foto's uploaden voor elk appartement
- ✅ Foto's verwijderen
- ✅ Volgorde van foto's aanpassen
- ✅ Hoofdfoto kiezen
- ✅ Appartementen activeren/deactiveren
- ✅ Reviews bekijken (later beheren)

## 🐛 Problemen?

### "Failed to fetch" error

- Controleer of je `.env.local` correct is ingevuld
- Herstart de development server (`npm run dev`)

### "Invalid API key"

- Controleer of je de juiste keys hebt gekopieerd
- Keys moeten beginnen met `https://` (URL) en lang zijn (keys)

### Foto's uploaden niet

- Controleer of de Storage bucket `apartment-images` bestaat
- Controleer of de bucket op "Public" staat
- Controleer of de policies zijn aangemaakt

### Kan niet inloggen

- Controleer of je een user hebt aangemaakt in Authentication
- Controleer of "Auto Confirm User" AAN staat

## 📚 Volgende Stappen

Je kunt nu uitbreiden met:

- Appartement edit formulier (teksten wijzigen via dashboard)
- Reviews moderatie interface
- Meerdere admin users
- Upload progress bars
- Image cropping
- En meer!

## 💰 Kosten

**Gratis tier van Supabase bevat:**

- 500 MB database
- 1 GB file storage (voor foto's)
- 50,000 monthly active users
- Onbeperkte API requests

Dit is **RUIM VOLDOENDE** voor een appartement verhuur website! 🎉

## 🆘 Hulp Nodig?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

---

**Klaar! Je hebt nu een professioneel CMS systeem! 🚀**
