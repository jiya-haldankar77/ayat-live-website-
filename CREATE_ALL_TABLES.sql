-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/urbkhjifbtgyeakvwowu/sql/new
-- This creates all required tables for the AAYAT application

-- Contact Inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  interested_property text,
  budget text,
  source_page text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Properties
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  location text,
  property_type text,
  region text,
  price_value numeric,
  price_display text,
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  images text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Amenities
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Property Amenities (junction table)
CREATE TABLE IF NOT EXISTS property_amenities (
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id uuid REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- Property Floorplans
CREATE TABLE IF NOT EXISTS property_floorplans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  title text,
  image_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Property Documents
CREATE TABLE IF NOT EXISTS property_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  title text,
  file_url text,
  created_at timestamptz DEFAULT now()
);

-- Property Videos
CREATE TABLE IF NOT EXISTS property_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  title text,
  video_url text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  visit_date date,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'unpaid',
  created_at timestamptz DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  location text,
  rating integer,
  text text NOT NULL,
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  bio text,
  image_url text,
  email text,
  phone text,
  linkedin text,
  published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  location text,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  type text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity text,
  entity_id text,
  detail text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_floorplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_inquiries
DROP POLICY IF EXISTS "public_insert_inquiries" ON contact_inquiries;
CREATE POLICY "public_insert_inquiries" ON contact_inquiries 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_inquiries" ON contact_inquiries;
CREATE POLICY "auth_all_inquiries" ON contact_inquiries 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for properties
DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties" ON properties 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_properties" ON properties;
CREATE POLICY "auth_all_properties" ON properties 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for settings (public read)
DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "auth_all_settings" ON settings;
CREATE POLICY "auth_all_settings" ON settings 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for testimonials
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_testimonials" ON testimonials;
CREATE POLICY "auth_all_testimonials" ON testimonials 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for FAQs
DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_faqs" ON faqs;
CREATE POLICY "auth_all_faqs" ON faqs 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for team members
DROP POLICY IF EXISTS "public_read_team" ON team_members;
CREATE POLICY "public_read_team" ON team_members 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_team" ON team_members;
CREATE POLICY "auth_all_team" ON team_members 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for projects
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "auth_all_projects" ON projects;
CREATE POLICY "auth_all_projects" ON projects 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for bookings
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_bookings" ON bookings;
CREATE POLICY "auth_all_bookings" ON bookings 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for notifications
DROP POLICY IF EXISTS "auth_all_notifications" ON notifications;
CREATE POLICY "auth_all_notifications" ON notifications 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- RLS Policies for activity logs
DROP POLICY IF EXISTS "auth_all_activity" ON activity_logs;
CREATE POLICY "auth_all_activity" ON activity_logs 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
  ('phone', '+91 98765 43210'),
  ('email', 'info@aayatprojects.com'),
  ('address', 'Goa, India'),
  ('whatsapp', '919876543210')
ON CONFLICT (key) DO NOTHING;
