import connectDB from '../lib/db.js';
import { Admin, Property, Booking, Inquiry, Testimonial, Faq, Team, Settings, ActivityLog, Category, Amenity } from '../lib/models.js';
import { verifyAuth, JWT_SECRET } from '../lib/auth.js';
import { logActivity } from '../lib/activity.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Parse request body for POST/PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(data ? JSON.parse(data) : {});
          } catch (e) {
            console.error('JSON parse error:', e);
            resolve({});
          }
        });
        req.on('error', reject);
      });
      req.body = body;
      console.log('[API] Parsed body:', JSON.stringify(body));
    } catch (error) {
      console.error('[API] Error parsing request body:', error);
    }
  }

  try {
    await connectDB();
    console.log('[API] MongoDB connected');
  } catch (error) {
    console.error('[API] MongoDB connection error:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  console.log('[API] Request:', req.method, pathname);

  // ========== AUTH ROUTES ==========
  // POST /api/auth/login
  if (req.method === 'POST' && pathname.endsWith('/auth/login')) {
    try {
      console.log('[API] Login attempt for email:', req.body?.email);
      const { email, password } = req.body;
      if (!email || !password) {
        console.log('[API] Missing email or password');
        return res.status(400).json({ error: 'Email and password required' });
      }
      
      let admin = await Admin.findOne({ email });
      console.log('[API] Admin found:', !!admin);
      
      // Auto-seed admin if none exists (fallback for first-time deployment)
      if (!admin) {
        const adminCount = await Admin.countDocuments();
        console.log('[API] Admin count:', adminCount);
        if (adminCount === 0) {
          console.log('[API] No admin users found, creating default admin');
          const hashedPassword = await bcrypt.hash('admin123', 10);
          admin = await Admin.create({
            email: 'admin@aayatprojects.in',
            password: hashedPassword,
            role: 'admin'
          });
          console.log('[API] Default admin created');
        }
      }
      
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        console.log('[API] Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
      console.log('[API] Login successful');
      return res.json({ token, admin: { id: admin._id, email: admin.email, role: admin.role } });
    } catch (error) {
      console.error('[API] Login error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  // POST /api/auth/register
  if (req.method === 'POST' && pathname.endsWith('/auth/register')) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({ email, password: hashedPassword });
      return res.json({ message: 'Admin created', admin: { id: admin._id, email: admin.email } });
    } catch (error) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  // GET /api/auth/me
  if (req.method === 'GET' && pathname.endsWith('/auth/me')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'Invalid token' });
    return res.json({ admin: { id: admin._id, email: admin.email, role: admin.role } });
  }

  // ========== PROPERTIES ROUTES ==========
  // GET /api/properties/published
  if (req.method === 'GET' && pathname.endsWith('/properties/published')) {
    try {
      const properties = await Property.find({ published: true }).sort({ created_at: -1 });
      return res.json(properties);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  }

  // GET /api/properties
  if (req.method === 'GET' && (pathname === '/api/properties' || pathname === '/api/properties/')) {
    try {
      const properties = await Property.find().sort({ created_at: -1 });
      return res.json(properties);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  }

  // POST /api/properties
  if (req.method === 'POST' && pathname === '/api/properties') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const property = await Property.create(req.body);
      await logActivity('create', 'property', property._id, `Created property: ${property.title}`);
      return res.json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      return res.status(500).json({ error: 'Failed to create property' });
    }
  }

  // PUT /api/properties/:id
  if (req.method === 'PUT' && pathname.match(/^\/api\/properties\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const property = await Property.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'property', id, `Updated property: ${property.title}`);
      return res.json(property);
    } catch (error) {
      console.error('Error updating property:', error);
      return res.status(500).json({ error: 'Failed to update property' });
    }
  }

  // DELETE /api/properties/:id
  if (req.method === 'DELETE' && pathname.match(/^\/api\/properties\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Property.findByIdAndDelete(id);
      await logActivity('delete', 'property', id, 'Deleted property');
      return res.json({ message: 'Property deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete property' });
    }
  }

  // ========== BOOKINGS ROUTES ==========
  // GET /api/bookings
  if (req.method === 'GET' && pathname === '/api/bookings') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const bookings = await Booking.find().sort({ created_at: -1 });
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  // POST /api/bookings
  if (req.method === 'POST' && pathname === '/api/bookings') {
    try {
      const booking = await Booking.create(req.body);
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  // PUT /api/bookings/:id
  if (req.method === 'PUT' && pathname.match(/^\/api\/bookings\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'booking', id, `Updated booking status to ${req.body.status}`);
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update booking' });
    }
  }

  // DELETE /api/bookings/:id
  if (req.method === 'DELETE' && pathname.match(/^\/api\/bookings\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Booking.findByIdAndDelete(id);
      await logActivity('delete', 'booking', id, 'Deleted booking');
      return res.json({ message: 'Booking deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete booking' });
    }
  }

  // ========== INQUIRIES ROUTES ==========
  // GET /api/inquiries
  if (req.method === 'GET' && pathname === '/api/inquiries') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const inquiries = await Inquiry.find().sort({ created_at: -1 });
      return res.json(inquiries);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  }

  // POST /api/inquiries
  if (req.method === 'POST' && pathname === '/api/inquiries') {
    try {
      console.log('[API] Creating inquiry:', JSON.stringify(req.body));
      const inquiry = await Inquiry.create(req.body);
      console.log('[API] Inquiry created successfully');
      return res.json(inquiry);
    } catch (error) {
      console.error('[API] Inquiry creation error:', error);
      return res.status(500).json({ error: 'Failed to create inquiry' });
    }
  }

  // PUT /api/inquiries/:id
  if (req.method === 'PUT' && pathname.match(/^\/api\/inquiries\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const inquiry = await Inquiry.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'inquiry', id, `Updated inquiry status to ${req.body.status}`);
      return res.json(inquiry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update inquiry' });
    }
  }

  // DELETE /api/inquiries/:id
  if (req.method === 'DELETE' && pathname.match(/^\/api\/inquiries\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Inquiry.findByIdAndDelete(id);
      await logActivity('delete', 'inquiry', id, 'Deleted inquiry');
      return res.json({ message: 'Inquiry deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete inquiry' });
    }
  }

  // ========== TESTIMONIALS ROUTES ==========
  // GET /api/testimonials/published
  if (req.method === 'GET' && pathname.endsWith('/testimonials/published')) {
    try {
      const testimonials = await Testimonial.find({ published: true }).sort({ created_at: -1 });
      return res.json(testimonials);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }

  // GET /api/testimonials
  if (req.method === 'GET' && pathname === '/api/testimonials') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const testimonials = await Testimonial.find().sort({ created_at: -1 });
      return res.json(testimonials);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }

  // POST /api/testimonials
  if (req.method === 'POST' && pathname === '/api/testimonials') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const testimonial = await Testimonial.create(req.body);
      await logActivity('create', 'testimonial', testimonial._id, `Created testimonial from ${testimonial.author}`);
      return res.json(testimonial);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create testimonial' });
    }
  }

  // PUT /api/testimonials/:id
  if (req.method === 'PUT' && pathname.match(/^\/api\/testimonials\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'testimonial', id, 'Updated testimonial');
      return res.json(testimonial);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update testimonial' });
    }
  }

  // DELETE /api/testimonials/:id
  if (req.method === 'DELETE' && pathname.match(/^\/api\/testimonials\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Testimonial.findByIdAndDelete(id);
      await logActivity('delete', 'testimonial', id, 'Deleted testimonial');
      return res.json({ message: 'Testimonial deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  }

  // ========== FAQs ROUTES ==========
  // GET /api/faqs/published
  if (req.method === 'GET' && pathname.endsWith('/faqs/published')) {
    try {
      const faqs = await Faq.find({ published: true }).sort({ sort_order: 1 });
      return res.json(faqs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  }

  // GET /api/faqs
  if (req.method === 'GET' && pathname === '/api/faqs') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const faqs = await Faq.find().sort({ sort_order: 1 });
      return res.json(faqs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  }

  // POST /api/faqs
  if (req.method === 'POST' && pathname === '/api/faqs') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const faq = await Faq.create(req.body);
      await logActivity('create', 'faq', faq._id, `Created FAQ: ${faq.question}`);
      return res.json(faq);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create FAQ' });
    }
  }

  // PUT /api/faqs/:id
  if (req.method === 'PUT' && pathname.match(/^\/api\/faqs\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'faq', id, 'Updated FAQ');
      return res.json(faq);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update FAQ' });
    }
  }

  // DELETE /api/faqs/:id
  if (req.method === 'DELETE' && pathname.match(/^\/api\/faqs\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Faq.findByIdAndDelete(id);
      await logActivity('delete', 'faq', id, 'Deleted FAQ');
      return res.json({ message: 'FAQ deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  }

  // ========== TEAM ROUTES ==========
  // GET /api/team/published
  if (req.method === 'GET' && pathname.endsWith('/team/published')) {
    try {
      const team = await Team.find({ published: true }).sort({ sort_order: 1 });
      return res.json(team);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch team' });
    }
  }

  // GET /api/team
  if (req.method === 'GET' && pathname === '/api/team') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const team = await Team.find().sort({ sort_order: 1 });
      return res.json(team);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch team' });
    }
  }

  // POST /api/team
  if (req.method === 'POST' && pathname === '/api/team') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const member = await Team.create(req.body);
      await logActivity('create', 'team_member', member._id, `Created team member: ${member.name}`);
      return res.json(member);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create team member' });
    }
  }

  // PUT /api/team/:id
  if (req.method === 'PUT' && pathname.match(/^\/api\/team\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const member = await Team.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'team_member', id, 'Updated team member');
      return res.json(member);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update team member' });
    }
  }

  // DELETE /api/team/:id
  if (req.method === 'DELETE' && pathname.match(/^\/api\/team\/[^/]+$/)) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Team.findByIdAndDelete(id);
      await logActivity('delete', 'team_member', id, 'Deleted team member');
      return res.json({ message: 'Team member deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete team member' });
    }
  }

  // ========== DASHBOARD ROUTES ==========
  // GET /api/dashboard/stats
  if (req.method === 'GET' && pathname.endsWith('/dashboard/stats')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const [totalProperties, totalBookings, totalInquiries, notifications] = await Promise.all([
        Property.countDocuments(),
        Booking.countDocuments(),
        Inquiry.countDocuments(),
        ActivityLog.find().sort({ created_at: -1 }).limit(5)
      ]);
      return res.json({ totalProperties, totalBookings, totalInquiries, notifications });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  // ========== SETTINGS ROUTES ==========
  // GET /api/settings
  if (req.method === 'GET' && pathname === '/api/settings') {
    try {
      const settings = await Settings.find({});
      const settingsObj = {};
      settings.forEach(s => settingsObj[s.key] = s.value);
      return res.json(settingsObj);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  // PUT /api/settings
  if (req.method === 'PUT' && pathname === '/api/settings') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const { key, value } = req.body;
      await Settings.findOneAndUpdate({ key }, { value, updated_at: new Date() }, { upsert: true });
      await logActivity('update', 'setting', key, `Updated setting: ${key}`);
      return res.json({ message: 'Setting updated' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update setting' });
    }
  }

  // ========== CATEGORIES ROUTES ==========
  // GET /api/categories
  if (req.method === 'GET' && pathname === '/api/categories') {
    try {
      const categories = await Category.find();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  // ========== AMENITIES ROUTES ==========
  // GET /api/amenities
  if (req.method === 'GET' && pathname === '/api/amenities') {
    try {
      const amenities = await Amenity.find();
      return res.json(amenities);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch amenities' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
