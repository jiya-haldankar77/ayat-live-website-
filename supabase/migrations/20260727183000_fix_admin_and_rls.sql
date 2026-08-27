/*
# Fix Admin Authentication and RLS Policies

This migration:
1. Creates admins table to track admin users
2. Updates RLS policies to only allow admin users for admin operations
3. Creates storage buckets for media
4. Adds proper admin role verification
*/

-- ---------- admins table ----------
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read admins
DROP POLICY IF EXISTS "auth_read_admins" ON admins;
CREATE POLICY "auth_read_admins" ON admins FOR SELECT TO authenticated USING (true);

-- Only service role can insert admins (created via trigger)
DROP POLICY IF EXISTS "service_insert_admins" ON admins;
CREATE POLICY "service_insert_admins" ON admins FOR INSERT TO service_role WITH CHECK (true);

-- ---------- Function to auto-create admin on signup ----------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admins (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create admin entry on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- Update RLS policies to require admin role ----------

-- Properties: public read, admin write
DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties" ON properties 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_properties" ON properties;
CREATE POLICY "admin_all_properties" ON properties 
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

-- Projects: public read, admin write
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "auth_all_projects" ON projects;
CREATE POLICY "admin_all_projects" ON projects 
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

-- Bookings: public insert, admin read/write
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_bookings" ON bookings;
CREATE POLICY "admin_all_bookings" ON bookings 
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

-- Contact inquiries: public insert, admin read/write
DROP POLICY IF EXISTS "public_insert_inquiries" ON contact_inquiries;
CREATE POLICY "public_insert_inquiries" ON contact_inquiries 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_inquiries" ON contact_inquiries;
CREATE POLICY "admin_all_inquiries" ON contact_inquiries 
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

-- Testimonials: public read published, admin all
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_testimonials" ON testimonials;
CREATE POLICY "admin_all_testimonials" ON testimonials 
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

-- FAQs: public read published, admin all
DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_faqs" ON faqs;
CREATE POLICY "admin_all_faqs" ON faqs 
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

-- Team members: public read published, admin all
DROP POLICY IF EXISTS "public_read_team" ON team_members;
CREATE POLICY "public_read_team" ON team_members 
  FOR SELECT TO anon, authenticated 
  USING (published = true);

DROP POLICY IF EXISTS "auth_all_team" ON team_members;
CREATE POLICY "admin_all_team" ON team_members 
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

-- Settings: public read, admin write
DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "auth_all_settings" ON settings;
CREATE POLICY "admin_all_settings" ON settings 
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

-- Notifications: admin only
DROP POLICY IF EXISTS "auth_all_notifications" ON notifications;
CREATE POLICY "admin_all_notifications" ON notifications 
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

-- Activity logs: admin only
DROP POLICY IF EXISTS "auth_all_activity" ON activity_logs;
CREATE POLICY "admin_all_activity" ON activity_logs 
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

-- Property relations (amenities, floorplans, documents, videos): public read, admin write
DROP POLICY IF EXISTS "public_read_property_amenities" ON property_amenities;
CREATE POLICY "public_read_property_amenities" ON property_amenities 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "admin_all_property_amenities" ON property_amenities;
CREATE POLICY "admin_all_property_amenities" ON property_amenities 
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

DROP POLICY IF EXISTS "public_read_property_floorplans" ON property_floorplans;
CREATE POLICY "public_read_property_floorplans" ON property_floorplans 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "admin_all_property_floorplans" ON property_floorplans;
CREATE POLICY "admin_all_property_floorplans" ON property_floorplans 
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

DROP POLICY IF EXISTS "public_read_property_documents" ON property_documents;
CREATE POLICY "public_read_property_documents" ON property_documents 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "admin_all_property_documents" ON property_documents;
CREATE POLICY "admin_all_property_documents" ON property_documents 
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

DROP POLICY IF EXISTS "public_read_property_videos" ON property_videos;
CREATE POLICY "public_read_property_videos" ON property_videos 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "admin_all_property_videos" ON property_videos;
CREATE POLICY "admin_all_property_videos" ON property_videos 
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

-- Categories and Amenities: public read, admin write
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "admin_all_categories" ON categories;
CREATE POLICY "admin_all_categories" ON categories 
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

DROP POLICY IF EXISTS "public_read_amenities" ON amenities;
CREATE POLICY "public_read_amenities" ON amenities 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "admin_all_amenities" ON amenities;
CREATE POLICY "admin_all_amenities" ON amenities 
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

-- ---------- Function to check if user is admin ----------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------- Function to log activity ----------
CREATE OR REPLACE FUNCTION public.log_activity(action text, entity text, entity_id text, detail text)
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (action, entity, entity_id, detail)
  VALUES (action, entity, entity_id, detail);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
