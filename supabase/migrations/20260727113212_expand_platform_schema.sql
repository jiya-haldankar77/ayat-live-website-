/*
# Expand schema for full real estate platform

Adds normalized tables for properties (with slug, brochure, floor plans, video, completion date),
bookings, contact inquiries, testimonials, faqs, team members, amenities, categories, settings,
notifications, and activity logs. Storage buckets are created via Supabase dashboard; this
migration focuses on table schema + RLS.

1. New Tables
- categories — property categories (e.g. Villa, Apartment)
- amenities — master amenities list
- property_amenities — join table properties <-> amenities
- property_floorplans — floor plan images per property
- property_documents — brochures / PDFs per property
- property_videos — video URLs per property
- bookings — customer booking requests tied to a property
- contact_inquiries — contact form submissions
- testimonials — client testimonials (admin-managed)
- faqs — frequently asked questions (admin-managed)
- team_members — team / leadership entries (admin-managed)
- settings — site-wide key/value config (hero text, contact details, social links)
- notifications — admin notification feed
- activity_logs — audit trail of admin actions

2. Modified Tables
- properties: add slug (unique), short_description, price_range, completion_date,
  latitude, longitude, map_embed_url, published flag, category_id FK.

3. Security
- RLS enabled on all new tables.
- Public read on content tables (properties, categories, amenities, floorplans, documents,
  videos, testimonials, faqs, team_members, settings): TO anon, authenticated.
- Bookings & contact inquiries: public can INSERT (TO anon, authenticated), only authenticated
  admins can SELECT/UPDATE/DELETE.
- notifications, activity_logs: authenticated only.
*/

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

-- ---------- amenities ----------
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_amenities" ON amenities;
CREATE POLICY "public_read_amenities" ON amenities FOR SELECT TO anon, authenticated USING (true);

-- ---------- property_amenities ----------
CREATE TABLE IF NOT EXISTS property_amenities (
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id uuid NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_property_amenities" ON property_amenities;
CREATE POLICY "public_read_property_amenities" ON property_amenities FOR SELECT TO anon, authenticated USING (true);

-- ---------- property_floorplans ----------
CREATE TABLE IF NOT EXISTS property_floorplans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  label text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE property_floorplans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_property_floorplans" ON property_floorplans;
CREATE POLICY "public_read_property_floorplans" ON property_floorplans FOR SELECT TO anon, authenticated USING (true);

-- ---------- property_documents ----------
CREATE TABLE IF NOT EXISTS property_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  label text NOT NULL DEFAULT 'Brochure',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_property_documents" ON property_documents;
CREATE POLICY "public_read_property_documents" ON property_documents FOR SELECT TO anon, authenticated USING (true);

-- ---------- property_videos ----------
CREATE TABLE IF NOT EXISTS property_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  video_url text NOT NULL,
  label text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE property_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_property_videos" ON property_videos;
CREATE POLICY "public_read_property_videos" ON property_videos FOR SELECT TO anon, authenticated USING (true);

-- ---------- bookings ----------
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  booking_date date NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_all_bookings" ON bookings;
CREATE POLICY "auth_all_bookings" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- contact_inquiries ----------
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  interested_property text,
  budget text,
  source_page text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_inquiries" ON contact_inquiries;
CREATE POLICY "public_insert_inquiries" ON contact_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_all_inquiries" ON contact_inquiries;
CREATE POLICY "auth_all_inquiries" ON contact_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- testimonials ----------
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL,
  role text,
  image text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_testimonials" ON testimonials;
CREATE POLICY "auth_all_testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- faqs ----------
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_faqs" ON faqs;
CREATE POLICY "auth_all_faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- team_members ----------
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_team" ON team_members;
CREATE POLICY "public_read_team" ON team_members FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_team" ON team_members;
CREATE POLICY "auth_all_team" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- settings ----------
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_settings" ON settings;
CREATE POLICY "auth_all_settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- notifications ----------
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_notifications" ON notifications;
CREATE POLICY "auth_all_notifications" ON notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- activity_logs ----------
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity text,
  entity_id text,
  detail text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_activity" ON activity_logs;
CREATE POLICY "auth_all_activity" ON activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- extend properties ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='slug') THEN
    ALTER TABLE properties ADD COLUMN slug text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='short_description') THEN
    ALTER TABLE properties ADD COLUMN short_description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='price_range') THEN
    ALTER TABLE properties ADD COLUMN price_range text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='completion_date') THEN
    ALTER TABLE properties ADD COLUMN completion_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='latitude') THEN
    ALTER TABLE properties ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='longitude') THEN
    ALTER TABLE properties ADD COLUMN longitude double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='map_embed_url') THEN
    ALTER TABLE properties ADD COLUMN map_embed_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='published') THEN
    ALTER TABLE properties ADD COLUMN published boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='category_id') THEN
    ALTER TABLE properties ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- unique slug where not null
DROP INDEX IF EXISTS idx_properties_slug;
CREATE UNIQUE INDEX idx_properties_slug ON properties(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_published ON properties(published);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status);

-- Allow authenticated full management of properties/projects (admin)
DROP POLICY IF EXISTS "auth_all_properties" ON properties;
CREATE POLICY "auth_all_properties" ON properties FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_all_projects" ON projects;
CREATE POLICY "auth_all_projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- seed reference data ----------
INSERT INTO categories (name, slug) VALUES
  ('Villa', 'villa'),
  ('Apartment', 'apartment'),
  ('Penthouse', 'penthouse'),
  ('Commercial', 'commercial'),
  ('Land', 'land'),
  ('Mixed Use', 'mixed-use')
ON CONFLICT (name) DO NOTHING;

INSERT INTO amenities (name, icon) VALUES
  ('Swimming Pool', 'waves'),
  ('Private Garden', 'trees'),
  ('Sea View', 'sun'),
  ('Smart Home', 'cpu'),
  ('Modular Kitchen', 'utensils'),
  ('Covered Parking', 'car'),
  ('Staff Quarters', 'users'),
  ('Home Theatre', 'film'),
  ('Wine Cellar', 'wine'),
  ('Solar Power', 'zap'),
  ('Gym', 'dumbbell'),
  ('Concierge', 'bell'),
  ('Rooftop Terrace', 'building'),
  ('EV Charging', 'plug'),
  ('Beach Access', 'sailboat')
ON CONFLICT (name) DO NOTHING;

-- Assign slugs to existing properties
UPDATE properties SET slug = 'villa-serenity-siolim' WHERE title = 'Villa Serenity' AND slug IS NULL;
UPDATE properties SET slug = 'villa-oceana-candolim' WHERE title = 'Villa Oceana' AND slug IS NULL;
UPDATE properties SET slug = 'penthouse-azure-panaji' WHERE title = 'Penthouse Azure' AND slug IS NULL;
UPDATE properties SET slug = 'anjuna-heights-residence' WHERE title = 'Anjuna Heights Residence' AND slug IS NULL;
UPDATE properties SET slug = 'assagao-garden-estate' WHERE title = 'Assagao Garden Estate' AND slug IS NULL;
UPDATE properties SET slug = 'calangute-bay-apartment' WHERE title = 'Calangute Bay Apartment' AND slug IS NULL;
UPDATE properties SET slug = 'porvorim-smart-living' WHERE title = 'Porvorim Smart Living' AND slug IS NULL;
UPDATE properties SET slug = 'vagator-cliff-villa' WHERE title = 'Vagator Cliff Villa' AND slug IS NULL;

-- Map property types to categories
UPDATE properties p SET category_id = c.id FROM categories c WHERE c.slug = 'villa' AND p.property_type = 'villa' AND p.category_id IS NULL;
UPDATE properties p SET category_id = c.id FROM categories c WHERE c.slug = 'apartment' AND p.property_type = 'apartment' AND p.category_id IS NULL;
UPDATE properties p SET category_id = c.id FROM categories c WHERE c.slug = 'penthouse' AND p.property_type = 'penthouse' AND p.category_id IS NULL;

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('hero_title', 'Where Vision Meets'),
  ('hero_subtitle', 'Exceptional Living'),
  ('hero_description', 'Aayat Projects is a full-service design and development studio delivering architecture, interior design, project management, construction supervision, and turnkey villa solutions across Goa.'),
  ('phone', '+91 914545 0039'),
  ('email', 'hello@aayatprojects.in'),
  ('address', 'Porvorim, Sangolda, Goa 403521'),
  ('whatsapp', '919145450039'),
  ('instagram', 'https://instagram.com'),
  ('linkedin', 'https://linkedin.com'),
  ('youtube', 'https://youtube.com')
ON CONFLICT (key) DO NOTHING;

-- Seed testimonials, faqs, team
INSERT INTO testimonials (quote, author, role, image) VALUES
  ('AAYAT transformed our property launch into a cinematic experience. The attention to detail and strategic marketing approach resulted in a sale within 30 days at our asking price.', 'Rajesh Malhotra', 'Property Developer, Anjuna', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'),
  ('The SecureBuy process gave us complete peace of mind. As NRIs, we were nervous about purchasing remotely, but AAYAT''s due diligence was thorough and professional.', 'Priya & Arjun Nair', 'Buyers from Dubai', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80'),
  ('Their media production quality is unmatched. The drone footage and cinematic film they created for our villa project generated more inquiries than any other marketing we''ve done.', 'Sandeep Verma', 'MD, Verma Constructions', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, role, bio, image, sort_order) VALUES
  ('Deepak Haldankar', 'Founder & CEO', '15+ years in luxury real estate and hospitality marketing.', 'https://media.base44.com/images/public/69914f7001f99553f2c3de43/30997ebb6_02A880D1-32C4-4605-952D-A7711D10E9BB.JPG', 0)
ON CONFLICT DO NOTHING;

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('What areas in Goa do you cover?', 'We cover all of North and South Goa, including Siolim, Assagao, Anjuna, Candolim, Calangute, Porvorim, Panaji, and Vagator.', 0),
  ('Do you work with NRI buyers?', 'Yes. Our SecureBuy NRI Complete package provides end-to-end support including Power of Attorney, RBI/FEMA compliance, and embassy attestation.', 1),
  ('How long does a typical property launch take?', 'A standard launch runs 60 days of active marketing. Exclusive mandates run 90 days. Most featured properties sell within 45 days on average.', 2),
  ('Can I book a site visit before purchasing?', 'Absolutely. You can book a consultation or site visit directly from any property page or through our contact form.', 3)
ON CONFLICT DO NOTHING;
