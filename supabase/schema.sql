-- ============================================
-- San Marino 4 - Supabase Database Schema
-- ============================================
-- Voer dit script uit in de Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. APARTMENTS TABLE
-- ============================================
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL vriendelijke naam (bijv. 'plein', 'hoek')
  name VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  price_per_night DECIMAL(10, 2),
  max_guests INTEGER DEFAULT 4,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  size_m2 INTEGER,
  
  -- Voorzieningen als JSON
  facilities JSONB DEFAULT '[]'::jsonb,
  
  -- Locatie informatie
  location_details JSONB DEFAULT '{}'::jsonb,
  
  -- Huisregels
  house_rules JSONB DEFAULT '[]'::jsonb,
  
  -- Veiligheid
  safety_features JSONB DEFAULT '[]'::jsonb,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image_url TEXT,
  
  -- Status
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. APARTMENT IMAGES TABLE
-- ============================================
CREATE TABLE apartment_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Pad in Supabase Storage
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false, -- Hoofdfoto
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index voor sneller sorteren
CREATE INDEX idx_apartment_images_order ON apartment_images(apartment_id, display_order);

-- ============================================
-- 3. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  author_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  stay_date DATE,
  verified BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_apartment ON reviews(apartment_id, published);

-- ============================================
-- 4. ADMIN USERS TABLE (voor authenticatie)
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin', -- admin, super_admin
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 5. UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON apartments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public kan alles LEZEN
CREATE POLICY "Iedereen kan actieve appartementen zien"
  ON apartments FOR SELECT
  USING (active = true);

CREATE POLICY "Iedereen kan appartement foto's zien"
  ON apartment_images FOR SELECT
  USING (true);

CREATE POLICY "Iedereen kan gepubliceerde reviews zien"
  ON reviews FOR SELECT
  USING (published = true);

-- Alleen geauthenticeerde admins kunnen SCHRIJVEN
CREATE POLICY "Alleen admins kunnen appartementen aanpassen"
  ON apartments FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen foto's beheren"
  ON apartment_images FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Alleen admins kunnen reviews beheren"
  ON reviews FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- 7. STORAGE BUCKET SETUP
-- ============================================
-- Voer dit uit via Supabase Dashboard > Storage
-- Of via SQL (indien mogelijk in jouw versie):

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('apartment-images', 'apartment-images', true);

-- CREATE POLICY "Iedereen kan images bekijken"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'apartment-images');

-- CREATE POLICY "Admins kunnen images uploaden"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'apartment-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Admins kunnen images verwijderen"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'apartment-images' AND auth.role() = 'authenticated');

-- ============================================
-- 8. SEED DATA -Voorbeeld appartementen
-- ============================================

-- Appartement 1: Plein
INSERT INTO apartments (slug, name, subtitle, description, price_per_night, max_guests, bedrooms, bathrooms, size_m2, active, featured, facilities, meta_title, meta_description)
VALUES (
  'plein',
  'Appartement met zicht op zee en plein',
  'Luxe vakantieverblijf',
  'Direct aan het plein in Middelkerke met panoramisch zeezicht.',
  150.00,
  4,
  1,
  1,
  55,
  true,
  true,
  '[
    {"icon": "FaWifi", "text": "Snelle WiFi"},
    {"icon": "FaTv", "text": "Smart-tv"},
    {"icon": "FaCar", "text": "Meerdere parkeergelegenheiden"},
    {"icon": "FaUtensils", "text": "Volledig uitgeruste keuken"},
    {"icon": "FaBed", "text": "Luxe tweepersoonsbed"},
    {"icon": "FaBath", "text": "Moderne badkamer met douche"},
    {"icon": "FaCouch", "text": "Zithoek met slaapbank"},
    {"icon": "FaSnowflake", "text": "Airconditioning en verwarming"},
    {"icon": "FaGlassCheers", "text": "Vaatwasser"},
    {"icon": "FaLayerGroup", "text": "Beddenlakens voorzien"}
  ]'::jsonb,
  'Luxe studio aan Zee Middelkerke | San Marino 4 studio',
  'Direct aan het plein in Middelkerke - Moderne studio voor 4 personen met panoramisch zeezicht. Boek nu uw perfecte vakantie!'
);

-- Appartement 2: Hoek
INSERT INTO apartments (slug, name, subtitle, description, price_per_night, max_guests, bedrooms, bathrooms, size_m2, active, featured, facilities, meta_title, meta_description)
VALUES (
  'hoek',
  'Appartement met zicht op zee en hoek',
  'Luxe vakantieverblijf',
  'Prachtig hoekappartement met zeezicht in Middelkerke.',
  150.00,
  4,
  1,
  1,
  55,
  true,
  false,
  '[
    {"icon": "FaWifi", "text": "Snelle WiFi"},
    {"icon": "FaTv", "text": "Smart-tv"},
    {"icon": "FaCar", "text": "Meerdere parkeergelegenheiden"},
    {"icon": "FaUtensils", "text": "Volledig uitgeruste keuken"},
    {"icon": "FaBed", "text": "Luxe tweepersoonsbed"},
    {"icon": "FaBath", "text": "Moderne badkamer met douche"},
    {"icon": "FaCouch", "text": "Zithoek met slaapbank"},
    {"icon": "FaSnowflake", "text": "Airconditioning en verwarming"}
  ]'::jsonb,
  'Hoekappartement Middelkerke | San Marino 4',
  'Luxe hoekappartement met prachtig zeezicht in Middelkerke.'
);

-- ============================================
-- KLAAR! 🎉
-- ============================================
-- Volgende stappen:
-- 1. Maak een Storage bucket aan: 'apartment-images' (via Dashboard > Storage)
-- 2. Zet de bucket op 'Public'
-- 3. Voeg je eerste admin user toe via Supabase Authentication
-- 4. Upload foto's via het admin dashboard (komt nog)
