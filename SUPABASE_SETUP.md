# Supabase Setup Instructions

## Prerequisites
- A Supabase account (https://supabase.com)
- Your Supabase project URL and anon key

## Step 1: Configure Environment Variables

Create or update your `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your Supabase project dashboard → Settings → API.

## Step 2: Run Database Migrations

Run the migrations in order in the Supabase SQL Editor:

1. **20260727064313_create_properties_and_projects.sql** - Creates properties and projects tables
2. **20260727113212_expand_platform_schema.sql** - Adds normalized tables (categories, amenities, bookings, inquiries, etc.)
3. **20260727183000_fix_admin_and_rls.sql** - Creates admins table, fixes RLS policies, adds admin role verification

## Step 3: Create Storage Buckets

In Supabase dashboard → Storage, create these buckets:

1. **property-images** - For property photos
2. **gallery** - For gallery/portfolio images  
3. **brochures** - For PDF brochures
4. **videos** - For video files

For each bucket:
- Make it **Public** (so images can be displayed)
- Set file size limit to 50MB
- Enable allowed MIME types: image/*, application/pdf, video/*

## Step 4: Create Admin User

1. Go to Supabase dashboard → Authentication
2. Click "Add User" → "Create New User"
3. Enter admin email and password
4. Click "Create User"

The user will automatically be added to the `admins` table with role 'admin' due to the trigger.

## Step 5: Verify Setup

1. Start the dev server: `npm run dev`
2. Navigate to http://localhost:5173/admin
3. Login with your admin credentials
4. You should be redirected to /admin/dashboard

## Troubleshooting

### Admin login fails
- Check that the user exists in Supabase Authentication
- Verify the user is in the `admins` table with role 'admin'
- Check browser console for specific error messages

### RLS policy errors
- Ensure migration 20260727183000_fix_admin_and_rls.sql was run
- Check that the user has admin role in the admins table

### Storage upload errors
- Verify buckets are created and public
- Check storage policies if configured

## Security Notes

- RLS policies now require admin role for all write operations
- Public users can only read published content and submit forms
- Activity logs track all admin actions
- Never commit .env file to version control
