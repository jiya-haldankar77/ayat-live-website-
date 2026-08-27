-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vyytkfyzvycfzghewacv/sql/new

-- Step 1: Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies
DROP POLICY IF EXISTS "auth_read_admins" ON admins;
CREATE POLICY "auth_read_admins" ON admins 
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "service_insert_admins" ON admins;
CREATE POLICY "service_insert_admins" ON admins 
  FOR INSERT TO service_role WITH CHECK (true);

-- Step 4: Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admins (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Create activity logging function
CREATE OR REPLACE FUNCTION public.log_activity(action text, entity text, entity_id text, detail text)
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (action, entity, entity_id, detail)
  VALUES (action, entity, entity_id, detail);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create is_admin function
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

-- Step 8: Update RLS policies for properties (admin only for writes)
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

-- Step 9: Update RLS policies for bookings
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

-- Step 10: Update RLS policies for inquiries
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

-- Step 11: Update RLS policies for testimonials
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

-- Step 12: Update RLS policies for FAQs
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

-- Step 13: Update RLS policies for team members
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

-- Step 14: Update RLS policies for settings
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

-- Step 15: Update RLS policies for notifications
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

-- Step 16: Update RLS policies for activity logs
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
