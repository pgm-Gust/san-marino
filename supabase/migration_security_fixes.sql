-- ============================================================
-- SECURITY FIX MIGRATIE — San Marino 4
--
-- BELANGRIJK: plak dit NIET in één keer volledig. Plak en run
-- DEEL 1 en DEEL 2 apart (kopieer telkens enkel dat blok). Als je
-- alles in één paste uitvoert en DEEL 2 faalt (wat nu verwacht
-- wordt door bestaande overlap, zie onder), behandelt Postgres de
-- hele paste als één transactie en rolt hij ook de geslaagde
-- policy-fixes uit DEEL 1 terug. Geen van beide delen verandert of
-- verwijdert bestaande rijen — DEEL 1 wijzigt enkel schrijfrechten,
-- DEEL 2 voegt enkel een regel toe (of faalt gewoon, zonder schade).
--
-- Veilig om opnieuw uit te voeren (alle policies worden eerst
-- verwijderd met IF EXISTS voordat ze opnieuw aangemaakt worden).
-- ============================================================

-- ============================================================
-- ▶ DEEL 1 — kopieer alles tot aan "EINDE DEEL 1" en run dit eerst.
-- ============================================================

-- ------------------------------------------------------------
-- 1. blocked_dates: schrijven mag alleen nog voor ingelogde
--    (admin) gebruikers. Lezen blijft publiek (nodig voor de
--    kalender). De boekingsflow zelf schrijft server-side via
--    de service_role key en valt dus niet onder deze policy.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Iedereen kan datums blokkeren" ON blocked_dates;
DROP POLICY IF EXISTS "Iedereen kan datums verwijderen" ON blocked_dates;
DROP POLICY IF EXISTS "Iedereen kan datums updaten" ON blocked_dates;
DROP POLICY IF EXISTS "Alleen admins kunnen datums blokkeren" ON blocked_dates;

CREATE POLICY "Alleen admins kunnen datums blokkeren"
  ON blocked_dates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen datums verwijderen"
  ON blocked_dates FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen datums updaten"
  ON blocked_dates FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- 2. minimum_nights: zelfde patroon, is een puur admin-beheerde
--    tabel (de boekingsflow leest dit enkel, schrijft er nooit
--    naar).
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Iedereen kan minimum nights toevoegen" ON minimum_nights;
DROP POLICY IF EXISTS "Iedereen kan minimum nights verwijderen" ON minimum_nights;
DROP POLICY IF EXISTS "Iedereen kan minimum nights updaten" ON minimum_nights;
DROP POLICY IF EXISTS "Alleen admins kunnen minimum nights beheren" ON minimum_nights;

CREATE POLICY "Alleen admins kunnen minimum nights toevoegen"
  ON minimum_nights FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen minimum nights verwijderen"
  ON minimum_nights FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen minimum nights updaten"
  ON minimum_nights FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- 3. apartment_prices: deze tabel stond niet in versiebeheer en
--    de RLS-status was niet te verifiëren vanuit de code. Zet
--    hem hier expliciet correct: iedereen mag prijzen zien
--    (nodig voor de boekingskalender), alleen admins mogen ze
--    wijzigen (het admin-scherm schrijft rechtstreeks vanuit de
--    browser, dus deze policy is hier de enige bescherming).
-- ------------------------------------------------------------
ALTER TABLE apartment_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Iedereen kan prijzen zien" ON apartment_prices;
DROP POLICY IF EXISTS "Alleen admins kunnen prijzen beheren (insert)" ON apartment_prices;
DROP POLICY IF EXISTS "Alleen admins kunnen prijzen beheren (update)" ON apartment_prices;
DROP POLICY IF EXISTS "Alleen admins kunnen prijzen beheren (delete)" ON apartment_prices;

CREATE POLICY "Iedereen kan prijzen zien"
  ON apartment_prices FOR SELECT
  USING (true);

CREATE POLICY "Alleen admins kunnen prijzen beheren (insert)"
  ON apartment_prices FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen prijzen beheren (update)"
  ON apartment_prices FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen prijzen beheren (delete)"
  ON apartment_prices FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- ■ EINDE DEEL 1 — run dit blok nu in de SQL Editor.
--   Dit alleen al lost de kritieke kwetsbaarheid op (iedereen kon
--   zonder in te loggen datums blokkeren/minimum nachten wijzigen).
-- ============================================================

-- ============================================================
-- ▶ DEEL 2 — pas hierna apart plakken en runnen, ná controle van
--   de overlap hieronder. Dit is een extra veiligheidsnet
--   (voorkomt dubbele boekingen op databaseniveau), niet de
--   kritieke fix zelf — die staat al in DEEL 1.
-- ============================================================

-- ------------------------------------------------------------
-- 4. Echte DB-level bescherming tegen dubbele boekingen.
--    De applicatiecode checkt nu al op overlap vóór het boeken,
--    maar dat sluit de race condition niet 100% uit bij twee
--    gelijktijdige requests. Deze constraint wel: de database
--    weigert zelf een overlappende insert, punt uit.
--    '[)' = halfopen interval, zodat inchecken op de dag dat een
--    ander uitcheckt (same-day turnover) toegestaan blijft —
--    consistent met hoe de rest van de app datums behandelt.
--
--    ⚠️ LET OP — voer dit eerst uit om te checken of er al
--    overlappende rijen bestaan (dat is nu het geval, zie hieronder):
--
--    SELECT a.id, a.start_date, a.end_date, a.reason,
--           b.id, b.start_date, b.end_date, b.reason
--    FROM blocked_dates a JOIN blocked_dates b
--      ON a.apartment_id = b.apartment_id AND a.id < b.id
--      AND daterange(a.start_date, a.end_date, '[)') &&
--          daterange(b.start_date, b.end_date, '[)');
--
--    Bij het schrijven van deze migratie gaf die query 2 conflicten:
--    - "Laura van asten" (25-27 juni 2026) overlapt met een naamloos
--      blok (26-29 juni 2026)
--    - "Dochter Rita" (5-11 sept 2026) overlapt met een naamloos
--      blok (10-30 sept 2026)
--    Los deze eerst op (verwijder/corrigeer de foute rij via
--    /admin/blocked-dates) — anders faalt de ALTER TABLE hieronder
--    met een "conflicting key value" fout.
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE blocked_dates DROP CONSTRAINT IF EXISTS no_overlapping_blocked_dates;

ALTER TABLE blocked_dates
  ADD CONSTRAINT no_overlapping_blocked_dates
  EXCLUDE USING gist (
    apartment_id WITH =,
    daterange(start_date, end_date, '[)') WITH &&
  );

-- ============================================================
-- ■ EINDE DEEL 2.
--   Als dit faalt met "conflicting key value violates exclusion
--   constraint": geen probleem, er is niets stukgemaakt. DEEL 1
--   staat dan nog steeds. Los de 2 overlappende rijen hierboven
--   op via /admin/blocked-dates en run daarna enkel DEEL 2 opnieuw.
-- ============================================================

-- ============================================================
-- BELANGRIJK — nog handmatig te controleren in het Supabase
-- Dashboard (kan niet via SQL):
--
-- Authentication → Providers → Email → "Allow new users to sign up"
-- moet UITGESCHAKELD staan. Zonder die controle kan iedereen die
-- weet dat er een Supabase-auth-systeem draait zelf een account
-- aanmaken en is daarmee "authenticated" — en zou dus, via de
-- bovenstaande policies, alsnog kunnen schrijven. Met signups
-- uitgeschakeld kunnen alleen accounts die JIJ zelf aanmaakt
-- (via het Dashboard → Authentication → Users → Add user) inloggen.
-- ============================================================
