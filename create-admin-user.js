// Run this script to create an admin user via Supabase Auth API
// Usage: node create-admin-user.js

const { createClient } = require('@supabase/supabase-js');

// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://vyytkfyzvycfzghewacv.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // Get from Supabase Dashboard → Settings → API → service_role (secret)

const ADMIN_EMAIL = 'admin@aayatprojects.com';
const ADMIN_PASSWORD = 'AayatAdmin2026!';

async function createAdminUser() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('Creating admin user...');

  // Create user in auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      role: 'admin'
    }
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    return;
  }

  console.log('Auth user created:', authData.user.id);

  // Add to admins table
  const { error: adminError } = await supabase
    .from('admins')
    .insert({
      id: authData.user.id,
      email: ADMIN_EMAIL,
      role: 'admin'
    });

  if (adminError) {
    console.error('Error adding to admins table:', adminError);
    return;
  }

  console.log('Admin user created successfully!');
  console.log('Email:', ADMIN_EMAIL);
  console.log('Password:', ADMIN_PASSWORD);
}

createAdminUser();
