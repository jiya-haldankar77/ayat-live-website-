-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/urbkhjifbtgyeakvwowu/sql/new
-- This creates an admin user using Supabase's proper auth method
-- Then adds them to the admins table

-- Step 1: Create a function to sign up a user via Supabase auth
-- Note: This requires using Supabase's auth API, not direct SQL
-- The proper way is to use the Supabase Auth API or Dashboard

-- Alternative: Use Supabase Dashboard to create the user:
-- 1. Go to: https://supabase.com/dashboard/project/urbkhjifbtgyeakvwowu/auth/users
-- 2. Click "Add user"
-- 3. Enter email: admin@aayatprojects.com
-- 4. Enter password: AayatAdmin2026!
-- 5. Click "Create user"

-- Step 2: After creating the user via Dashboard, run this to add them to admins table:
-- Replace 'YOUR_USER_ID' with the actual UUID from the auth.users table

-- First, get the user ID:
SELECT id, email FROM auth.users WHERE email = 'admin@aayatprojects.com';

-- Then insert into admins table (replace USER_ID with the actual UUID from above):
INSERT INTO admins (id, email, role)
VALUES ('USER_ID_HERE', 'admin@aayatprojects.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify:
SELECT * FROM admins WHERE email = 'admin@aayatprojects.com';
