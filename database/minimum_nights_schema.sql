-- ============================================
-- MINIMUM NIGHTS TABLE
-- Stel minimum aantal nachten in per periode
-- ============================================

CREATE TABLE minimum_nights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apartment_id INTEGER REFERENCES apartments(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  min_nights INTEGER NOT NULL CHECK (min_nights > 0),
  reason TEXT, -- Bijv. "Zomervakantie", "Weekendregeling", etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validatie: end_date moet na start_date zijn
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Index voor snellere queries
CREATE INDEX idx_minimum_nights_apartment ON minimum_nights(apartment_id);
CREATE INDEX idx_minimum_nights_range ON minimum_nights(start_date, end_date);

-- Enable RLS
ALTER TABLE minimum_nights ENABLE ROW LEVEL SECURITY;

-- Iedereen kan minimum nights zien
CREATE POLICY "Iedereen kan minimum nights zien"
  ON minimum_nights FOR SELECT
  USING (true);

-- Iedereen kan minimum nights beheren (voor development)
CREATE POLICY "Iedereen kan minimum nights toevoegen"
  ON minimum_nights FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Iedereen kan minimum nights verwijderen"
  ON minimum_nights FOR DELETE
  USING (true);

CREATE POLICY "Iedereen kan minimum nights updaten"
  ON minimum_nights FOR UPDATE
  USING (true);

-- Trigger voor updated_at
CREATE TRIGGER update_minimum_nights_updated_at BEFORE UPDATE ON minimum_nights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VOORBEELD DATA
-- ============================================
-- Zomer: minimum 7 nachten
INSERT INTO minimum_nights (apartment_id, start_date, end_date, min_nights, reason)
VALUES (1, '2026-07-01', '2026-08-31', 7, 'Zomervakantie');

-- Rest van het jaar: minimum 2 nachten
INSERT INTO minimum_nights (apartment_id, start_date, end_date, min_nights, reason)
VALUES (1, '2026-01-01', '2026-06-30', 2, 'Standaard periode');

INSERT INTO minimum_nights (apartment_id, start_date, end_date, min_nights, reason)
VALUES (1, '2026-09-01', '2026-12-31', 2, 'Standaard periode');
