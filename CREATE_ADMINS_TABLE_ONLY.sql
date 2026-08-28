-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/urbkhjifbtgyeakvwowu/sql/new
-- This script ONLY creates the admins table and related functions
-- Run this BEFORE running CREATE_ADMIN_USER.sql

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

-- Step 4: Create trigger function (auto-adds users to admins with admin role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admins (id, email, role)
  VALUES (NEW.id, NEW.email, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger (auto-adds users to admins on signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Create is_admin function
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

-- Step 7: Verify the table was created
SELECT * FROM admins;
