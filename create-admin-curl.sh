#!/bin/bash

# Run this script to create an admin user via Supabase REST API
# Replace YOUR_SERVICE_ROLE_KEY with your actual service role key from Supabase Dashboard

SUPABASE_URL="https://vyytkfyzvycfzghewacv.supabase.co"
SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"  # Get from: Supabase Dashboard → Settings → API → service_role (secret)

ADMIN_EMAIL="admin@aayatprojects.com"
ADMIN_PASSWORD="AayatAdmin2026!"

echo "Creating admin user..."

# Create user via Supabase Auth API
curl -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -d '{
    "email": "'${ADMIN_EMAIL}'",
    "password": "'${ADMIN_PASSWORD}'",
    "email_confirm": true,
    "user_metadata": {
      "role": "admin"
    }
  }'

echo ""
echo "User created. Now check if they were added to admins table by the trigger."
