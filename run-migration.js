import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Running migration...');
    
    // Create admins table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS admins (
          id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email text NOT NULL,
          role text NOT NULL DEFAULT 'admin',
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    });
    
    if (tableError) {
      console.error('Error creating table:', tableError);
      return;
    }
    
    console.log('✓ Admins table created');
    
    // Enable RLS
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE admins ENABLE ROW LEVEL SECURITY;'
    });
    
    console.log('✓ RLS enabled');
    
    // Create policies
    await supabase.rpc('exec_sql', {
      query: `
        CREATE POLICY IF NOT EXISTS "auth_read_admins" ON admins 
        FOR SELECT TO authenticated USING (true);
      `
    });
    
    await supabase.rpc('exec_sql', {
      query: `
        CREATE POLICY IF NOT EXISTS "service_insert_admins" ON admins 
        FOR INSERT TO service_role WITH CHECK (true);
      `
    });
    
    console.log('✓ Policies created');
    
    // Create trigger function
    await supabase.rpc('exec_sql', {
      query: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.admins (id, email)
          VALUES (NEW.id, NEW.email);
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    console.log('✓ Trigger function created');
    
    // Create trigger
    await supabase.rpc('exec_sql', {
      query: `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    });
    
    console.log('✓ Trigger created');
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
