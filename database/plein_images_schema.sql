-- SQL schema voor alleen foto's van het plein appartement
-- (apartments tabel mag blijven bestaan, maar alleen images voor plein worden beheerd)

-- Table: apartment_images
CREATE TABLE IF NOT EXISTS apartment_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id integer NOT NULL, -- verwijst naar plein appartement (bijv. id=1)
    image_url text NOT NULL,
    storage_path text NOT NULL,
    display_order integer DEFAULT 0,
    is_primary boolean DEFAULT false,
    alt_text text,
    created_at timestamp with time zone DEFAULT now()
);

-- Index voor snel ophalen per appartement
CREATE INDEX IF NOT EXISTS idx_apartment_images_apartment_id ON apartment_images(apartment_id);

-- (optioneel) Apartments tabel, alleen voor referentie
CREATE TABLE IF NOT EXISTS apartments (
    id serial PRIMARY KEY,
    name text NOT NULL
);

-- Voeg het plein appartement toe als hij nog niet bestaat
INSERT INTO apartments (id, name)
VALUES (1, 'Plein Appartement')
ON CONFLICT (id) DO NOTHING;
