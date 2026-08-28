-- Check the handle_new_user function
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';
