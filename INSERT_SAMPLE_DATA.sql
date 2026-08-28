-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/urbkhjifbtgyeakvwowu/sql/new
-- This inserts sample data for the AAYAT application

-- Insert Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Villas', 'villas', 'Luxury villas in prime locations'),
  ('Apartments', 'apartments', 'Modern apartments with amenities'),
  ('Plots', 'plots', 'Residential and commercial plots'),
  ('Commercial', 'commercial', 'Office spaces and retail properties')
ON CONFLICT (slug) DO NOTHING;

-- Insert Amenities
INSERT INTO amenities (name, icon) VALUES
  ('Swimming Pool', 'pool'),
  ('Garden', 'leaf'),
  ('Parking', 'car'),
  ('Security', 'shield'),
  ('Gym', 'dumbbell'),
  ('Power Backup', 'zap'),
  ('Club House', 'home'),
  ('Children Play Area', 'smile')
ON CONFLICT DO NOTHING;

-- Insert Properties
INSERT INTO properties (title, slug, description, location, property_type, region, price_value, price_display, bedrooms, bathrooms, area_sqft, featured, published, images) VALUES
  ('Luxury Villa in North Goa', 'luxury-villa-north-goa', 'Stunning 4BHK villa with private pool and garden in prime location', 'Siolim, North Goa', 'Villas', 'North Goa', 25000000, '₹2.5 Cr', 4, 4, 3500, true, true, ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800']),
  ('Modern Apartment in Panjim', 'modern-apartment-panjim', '3BHK apartment with city views and modern amenities', 'Panjim, Goa', 'Apartments', 'North Goa', 8500000, '₹85 Lac', 3, 3, 1800, true, true, ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800']),
  ('Beachfront Villa in South Goa', 'beachfront-villa-south-goa', 'Exclusive beachfront villa with direct beach access', 'Palolem, South Goa', 'Villas', 'South Goa', 45000000, '₹4.5 Cr', 5, 5, 5000, false, true, ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800']),
  ('Commercial Plot in Vasco', 'commercial-plot-vasco', 'Prime commercial plot near airport', 'Vasco, Goa', 'Plots', 'South Goa', 12000000, '₹1.2 Cr', 0, 0, 2400, false, true, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'])
ON CONFLICT (slug) DO NOTHING;

-- Insert Projects
INSERT INTO projects (title, slug, description, location, image_url, featured) VALUES
  ('AAYAT Heights', 'aayat-heights', 'Premium residential complex with world-class amenities', 'Porvorim, North Goa', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', true),
  ('AAYAT Greens', 'aayat-greens', 'Eco-friendly villas surrounded by nature', 'Assagao, North Goa', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', false),
  ('AAYAT Plaza', 'aayat-plaza', 'Commercial hub with modern office spaces', 'Margao, South Goa', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', false)
ON CONFLICT (slug) DO NOTHING;

-- Insert Testimonials
INSERT INTO testimonials (author, location, rating, text, published) VALUES
  ('Rahul Sharma', 'Mumbai', 5, 'Excellent service from AAYAT. Found my dream villa in Goa within weeks!', true),
  ('Priya Patel', 'Delhi', 5, 'Professional team and transparent dealings. Highly recommended!', true),
  ('Amit Desai', 'Bangalore', 4, 'Great experience. The team helped us find the perfect property.', true)
ON CONFLICT DO NOTHING;

-- Insert FAQs
INSERT INTO faqs (question, answer, sort_order, published) VALUES
  ('What services does AAYAT provide?', 'We provide comprehensive real estate services including property sales, purchases, launch packages, developer partnerships, and media production for real estate.', 1, true),
  ('Do you offer property management services?', 'Yes, we offer property management services for our clients including maintenance, tenant management, and rental services.', 2, true),
  ('What areas do you cover?', 'We primarily focus on Goa but also have projects in other prime locations across India.', 3, true),
  ('How can I schedule a property visit?', 'You can schedule a visit by contacting us through our website, calling our office, or sending us a WhatsApp message.', 4, true)
ON CONFLICT DO NOTHING;

-- Insert Team Members
INSERT INTO team_members (name, role, bio, email, phone, published, sort_order) VALUES
  ('John D''Souza', 'Managing Director', 'With 15+ years in real estate, John leads AAYAT with vision and expertise.', 'john@aayatprojects.com', '+91 98765 43210', true, 1),
  ('Maria Fernandes', 'Sales Manager', 'Maria specializes in luxury properties and has helped hundreds of clients find their dream homes.', 'maria@aayatprojects.com', '+91 98765 43211', true, 2),
  ('Rohan Singh', 'Property Consultant', 'Rohan is an expert in North Goa properties and provides excellent client service.', 'rohan@aayatprojects.com', '+91 98765 43212', true, 3)
ON CONFLICT DO NOTHING;

-- Update Settings with better values
INSERT INTO settings (key, value) VALUES
  ('phone', '+91 98765 43210'),
  ('email', 'info@aayatprojects.com'),
  ('address', 'AAYAT Projects, Panjim, Goa 403001, India'),
  ('whatsapp', '919876543210'),
  ('facebook', 'https://facebook.com/aayatprojects'),
  ('instagram', 'https://instagram.com/aayatprojects'),
  ('linkedin', 'https://linkedin.com/company/aayatprojects')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verify data
SELECT 'Properties' as table_name, COUNT(*) as count FROM properties
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'FAQs', COUNT(*) FROM faqs
UNION ALL
SELECT 'Team Members', COUNT(*) FROM team_members
UNION ALL
SELECT 'Settings', COUNT(*) FROM settings;
