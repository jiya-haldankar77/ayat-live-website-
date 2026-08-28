-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/urbkhjifbtgyeakvwowu/sql/new
-- This script diagnoses the auth user creation failure

-- Step 1: Check all triggers on auth.users
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth'
ORDER BY trigger_name;

-- Step 2: Check the handle_new_user function
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';

-- Step 3: Check admins table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'admins'
ORDER BY ordinal_position;

-- Step 4: Check admins table constraints
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.admins'::regclass;

-- Step 5: Check RLS policies on admins table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'admins';

-- Step 6: Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 7: Check for any other functions that might interfere
SELECT 
  routine_name,
  routine_schema
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%user%';

-- Step 8: Check auth.users table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
AND table_name = 'users'
ORDER BY ordinal_position;

-- Step 9: Try to identify any database extensions that might interfere
SELECT extname, extversion FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp');

-- Step 10: Check for any NOT NULL constraints that might fail
SELECT 
  attnum,
  attname,
  attnotnull,
  atthasdef
FROM pg_attribute
WHERE attrelid = 'public.admins'::regclass
AND attnum > 0
AND NOT attisdropped;
