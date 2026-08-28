-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/urbkhjifbtgyeakvwowu/sql/new

-- ============================================================
-- UPDATE THESE VALUES BEFORE RUNNING:
-- ============================================================
-- Replace YOUR_EMAIL_HERE with your admin email
-- Replace YOUR_PASSWORD_HERE with your admin password
-- ============================================================

DO $$
DECLARE
  user_exists boolean;
  user_id uuid;
  admin_email text := 'admin@aayatprojects.com';  -- CHANGE THIS
  admin_password text := 'AayatAdmin2026!';  -- CHANGE THIS
BEGIN
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = admin_email) INTO user_exists;
  
  IF user_exists THEN
    -- User exists, get their ID
    SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
    RAISE NOTICE 'User already exists with ID: %', user_id;
  ELSE
    -- Create new user
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at,
      aud,
      role
    ) VALUES (
      gen_random_uuid(),
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated'
    )
    RETURNING id INTO user_id;
    RAISE NOTICE 'Created new user with ID: %', user_id;
  END IF;
  
  -- Step 2: Add or update the user in admins table
  INSERT INTO admins (id, email, role)
  VALUES (user_id, admin_email, 'admin')
  ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    updated_at = now();
    
  RAISE NOTICE 'Admin role assigned successfully';
END $$;

-- Step 3: Verify the admin was created
SELECT * FROM admins WHERE email = 'admin@aayatprojects.com';  -- CHANGE THIS TO MATCH EMAIL ABOVE
