# 🎯 QUICK START - Meteen Beginnen!

## ⚡ In 5 minuten werkend

### Stap 1: Supabase Account (2 min)

1. Ga naar **https://supabase.com**
2. Klik **"Start your project"** → Log in met GitHub
3. **"New Project"** → Naam: `san-marino` → Kies wachtwoord → Regio: **West EU**
4. Wacht 1-2 minuten...

### Stap 2: API Keys Kopiëren (1 min)

1. Klik op **tandwiel icoon** (Settings) links
2. Klik **"API"**
3. Kopieer de **Project URL** en **anon public key**
4. Open `.env.local` in je project en vul in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jouwproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stap 3: Database Aanmaken (1 min)

1. Ga naar **SQL Editor** in Supabase
2. **"New Query"**
3. Open `supabase/schema.sql` uit je project → **Kopieer alles**
4. Plak in SQL Editor → Klik **"RUN" ▶️**
5. Zie je "Success"? Perfect! ✅

### Stap 4: Storage voor Foto's (1 min)

1. Ga naar **Storage** in Supabase
2. **"New Bucket"** → Naam: `apartment-images` → **Public: ON** → Create
3. Klik op de bucket → **"Policies"** tab
4. Klik **"New Policy"** → Selecteer **"Allow public read access"**
5. Klik **"Review"** → **"Save policy"**

Voor upload/delete, maak nog 2 policies (copy-paste deze in SQL Editor):

```sql
CREATE POLICY "Auth users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'apartment-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'apartment-images' AND auth.role() = 'authenticated');
```

### Stap 5: Admin User (30 sec)

1. Ga naar **Authentication** → **Users**
2. **"Add user"** → **"Create new user"**
3. Email: `admin@sanmarino4.be` (of jouw email)
4. Wachtwoord: kies iets sterks
5. ✅ **"Auto Confirm User"** AAN!
6. **"Create user"**

### Stap 6: Test! (30 sec)

```bash
npm run dev
```

Ga naar: **http://localhost:3000/admin/login**

Login met je email/wachtwoord → Je ziet het dashboard! 🎉

## 📸 Eerste Foto Uploaden

1. Dashboard → **"Foto's Uploaden"**
2. Klik op een appartement → **"Foto's"** knop
3. Sleep een foto in het upload vak
4. Klik **"Foto Uploaden"**
5. Klaar!

Bekijk het appartement: `http://localhost:3000/appartement/plein`

## ✅ Wat Werkt Nu?

- ✅ Admin login op `/admin/login`
- ✅ Dashboard op `/admin/dashboard`
- ✅ Foto's uploaden & beheren
- ✅ Appartementen activeren/deactiveren
- ✅ Dynamische pagina's: `/appartement/plein` & `/appartement/hoek`
- ✅ Foto's worden opgehaald uit Supabase
- ✅ Reviews systeem (klaar voor gebruik)

## 🚀 Live Zetten

Wanneer je deploy naar Vercel/Netlify:

1. Voeg environment variables toe in je hosting dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

2. Deploy → Klaar!

3. Admin login: `https://jouwsite.com/admin/login`

## 💡 Tips voor je Klant

**Foto's uploaden:**

- Optimale grootte: 1920x1080px
- Formaat: JPG of PNG
- Max 5MB per foto

**Hoofdfoto instellen:**

- Klik op de ⭐ ster bij een foto
- Dit wordt de hoofdfoto op de overzichtspagina

**Volgorde wijzigen:**

- Gebruik ↑ ↓ pijltjes
- Eerste foto = hoofdfoto in de gallery

## 🆘 Probleem?

**"Invalid API key"**
→ Herstart dev server: `Ctrl+C` → `npm run dev`

**Foto's uploaden niet**
→ Controleer of bucket op "Public" staat

**Kan niet inloggen**
→ Check of "Auto Confirm User" AAN stond bij aanmaken

---

**Klaar! Veel succes! 🎉**

Meer details? Zie `SUPABASE_SETUP.md`
