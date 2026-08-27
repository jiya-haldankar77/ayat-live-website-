# AAYAT Projects — Luxury Real Estate Platform

A full-stack luxury real estate marketing platform built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

### Public Site
- **Home** — Hero, featured properties, services overview, stats, projects, portfolio, testimonials, FAQs, CTA
- **Properties** — Full listing page with search, filters (type, location, price, bedrooms), and sorting
- **Property Details** — Individual SEO-friendly pages with image gallery, floor plans, amenities, location map, booking form, and inquiry form
- **Projects** — Signature developments showcase
- **Gallery** — Visual portfolio with category filtering and lightbox
- **Services** — Launch packages, media production, developer retainer, turnkey building, SecureBuy due diligence
- **About** — Company story, values, team
- **Contact** — Form that saves to Supabase with inquiry type selection
- **Thank You** — Confirmation page after booking/inquiry
- **Privacy Policy** & **Terms of Service**
- **404 Page** — Custom not found page

### Admin Dashboard (`/admin`)
- **Secure authentication** — Supabase Auth (email + password), protected routes
- **Dashboard** — Analytics (total properties, bookings, inquiries), recent activity feed
- **Property Management** — Full CRUD, featured/published toggles, image management, all property fields
- **Booking Management** — View, confirm, reject, cancel, delete, update payment status
- **Inquiry Management** — View, mark read, archive, reply, export CSV, delete
- **Testimonials** — Full CRUD
- **FAQs** — Full CRUD with drag ordering
- **Team Members** — Full CRUD
- **Settings** — Edit hero text, contact details, social links without touching code

### Technical
- React Router for multi-page routing
- Supabase for database, auth, and storage
- Row Level Security on all tables
- Responsive design (mobile to ultra-wide)
- Scroll reveal animations
- Floating WhatsApp/Call/Back-to-top buttons
- Sticky navbar with mobile menu
- SEO: meta tags, OpenGraph, structured data (JSON-LD), sitemap, robots.txt

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The Supabase credentials are pre-configured in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Database
All tables, RLS policies, and seed data are applied via Supabase migrations. The schema includes:
- `properties`, `projects`, `categories`, `amenities`
- `property_amenities`, `property_floorplans`, `property_documents`, `property_videos`
- `bookings`, `contact_inquiries`
- `testimonials`, `faqs`, `team_members`
- `settings`, `notifications`, `activity_logs`

### 4. Create Admin User
In your Supabase dashboard, go to Authentication > Users and create a user with email + password. This user can then log in at `/admin`.

### 5. Run
```bash
npm run dev      # development
npm run build    # production build
npm run typecheck # type checking
```

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion / React Hook Form (installed)
- Supabase (PostgreSQL, Auth, Storage)
- Lucide Icons

## Deployment
The project is deployment-ready for Vercel. Connect your repo and deploy — the build output is in `dist/`.
