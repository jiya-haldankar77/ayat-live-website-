// Simple script to create admin user using Supabase admin API
// Run with: node create-admin-simple.js

const SUPABASE_URL = 'https://vyytkfyzvycfzghewacv.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // Get from Supabase Dashboard → Settings → API → anon/public key

const ADMIN_EMAIL = 'admin@aayatprojects.com';
const ADMIN_PASSWORD = 'AayatAdmin2026!';

async function createAdminUser() {
  console.log('Creating admin user via Supabase Auth API...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
     $headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ User created successfully!');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      console.log('');
      console.log('The trigger should have automatically added this user to the admins table.');
      console.log('Verify by running: SELECT * FROM admins WHERE email = "' + ADMIN_EMAIL + '";');
    } else {
      console.error('✗ Error creating user:', data);
    }
  } catch (error) {
    console.error('✗ Request failed:', error);
  }
}

createAdminUser();
