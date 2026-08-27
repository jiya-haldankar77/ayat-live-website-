/*
# Create properties and projects tables for AAYAT luxury real estate site

1. New Tables
- `properties` — individual luxury property listings shown on the Properties page.
  Columns: title, location, price display text, numeric price_value (for sorting/filtering),
  property_type (villa/apartment/penthouse/commercial/land/mixed_use), bedrooms, bathrooms,
  area_sqft, description, features (text[]), images (text[] of URLs), video_url, brochure_url,
  status (available/under_offer/sold/under_construction/coming_soon/ready_to_move),
  mandate_type (exclusive/open), featured flag, region (north/south).
- `projects` — AAYAT signature developments shown on the Our Projects page.
  Columns: name, tagline, location, project_type (villa_collection/residential_development/etc),
  status (planning/under_construction/completed), price_range, description, highlights (text[]),
  amenities (text[]), images (text[]), video_url, brochure_url, featured flag,
  total_units, available_units.

2. Security
- Enable RLS on both tables.
- This is a public marketing site with no sign-in, so allow anon + authenticated to SELECT.
  No INSERT/UPDATE/DELETE from the anon client (data is managed via dashboard/seed).

3. Notes
- price_value stored in rupees (integer) to support range filtering.
- Region derived from location for North/South Goa filter.
- Seeded with 8 properties and 6 projects mirroring the original site.
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  price text NOT NULL,
  price_value bigint NOT NULL DEFAULT 0,
  property_type text NOT NULL DEFAULT 'villa',
  bedrooms integer,
  bathrooms integer,
  area_sqft text,
  region text NOT NULL DEFAULT 'north',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  video_url text,
  brochure_url text,
  status text NOT NULL DEFAULT 'available',
  mandate_type text NOT NULL DEFAULT 'exclusive',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties" ON properties FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  location text NOT NULL,
  project_type text NOT NULL DEFAULT 'villa_collection',
  status text NOT NULL DEFAULT 'planning',
  price_range text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  video_url text,
  brochure_url text,
  featured boolean NOT NULL DEFAULT false,
  total_units text,
  available_units text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

-- Indexes for property filtering
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_value);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
