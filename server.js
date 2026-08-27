import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayat';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Global Mongoose plugin to map _id to virtual id for JSON responses
mongoose.plugin((schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  });
  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  });
});

// Schemas
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const propertySchema = new mongoose.Schema({
  title: String,
  slug: String,
  location: String,
  price: String,
  price_value: Number,
  price_range: String,
  property_type: String,
  category_id: String,
  bedrooms: Number,
  bathrooms: Number,
  area_sqft: String,
  region: String,
  description: String,
  short_description: String,
  features: [String],
  images: [String],
  video_url: String,
  brochure_url: String,
  status: String,
  mandate_type: String,
  featured: Boolean,
  published: Boolean,
  completion_date: Date,
  latitude: Number,
  longitude: Number,
  map_embed_url: String,
  created_at: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  property_id: String,
  customer_name: String,
  customer_email: String,
  customer_phone: String,
  booking_date: Date,
  notes: String,
  status: { type: String, default: 'pending' },
  payment_status: { type: String, default: 'unpaid' },
  created_at: { type: Date, default: Date.now }
});

const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  interested_property: String,
  budget: String,
  source_page: String,
  status: { type: String, default: 'new' },
  created_at: { type: Date, default: Date.now }
});

const testimonialSchema = new mongoose.Schema({
  quote: String,
  author: String,
  role: String,
  image: String,
  published: Boolean,
  created_at: { type: Date, default: Date.now }
});

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  sort_order: Number,
  published: Boolean,
  created_at: { type: Date, default: Date.now }
});

const teamSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  image: String,
  sort_order: Number,
  published: Boolean,
  created_at: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: String,
  updated_at: { type: Date, default: Date.now }
});

const activityLogSchema = new mongoose.Schema({
  action: String,
  entity: String,
  entity_id: String,
  detail: String,
  created_at: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  created_at: { type: Date, default: Date.now }
});

const amenitySchema = new mongoose.Schema({
  name: String,
  icon: String,
  created_at: { type: Date, default: Date.now }
});

// Models
const Admin = mongoose.model('Admin', adminSchema);
const Property = mongoose.model('Property', propertySchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Inquiry = mongoose.model('Inquiry', inquirySchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Faq = mongoose.model('Faq', faqSchema);
const Team = mongoose.model('Team', teamSchema);
const Settings = mongoose.model('Settings', settingsSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
const Category = mongoose.model('Category', categorySchema);
const Amenity = mongoose.model('Amenity', amenitySchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ error: 'Invalid token' });
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper function to log activity
const logActivity = async (action, entity, entity_id, detail) => {
  try {
    await ActivityLog.create({ action, entity, entity_id, detail });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword });
    res.json({ message: 'Admin created', admin: { id: admin._id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ admin: { id: req.admin._id, email: req.admin.email, role: req.admin.role } });
});

// Properties Routes
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ created_at: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/published', async (req, res) => {
  try {
    const properties = await Property.find({ published: true }).sort({ created_at: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.post('/api/properties', authMiddleware, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    await logActivity('create', 'property', property._id, `Created property: ${property.title}`);
    res.json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity('update', 'property', req.params.id, `Updated property: ${property.title}`);
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:id', authMiddleware, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    await logActivity('delete', 'property', req.params.id, 'Deleted property');
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Bookings Routes
app.get('/api/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.put('/api/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity('update', 'booking', req.params.id, `Updated booking status to ${req.body.status}`);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

app.delete('/api/bookings/:id', authMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    await logActivity('delete', 'booking', req.params.id, 'Deleted booking');
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Inquiries Routes
app.get('/api/inquiries', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ created_at: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

app.put('/api/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity('update', 'inquiry', req.params.id, `Updated inquiry status to ${req.body.status}`);
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

app.delete('/api/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    await logActivity('delete', 'inquiry', req.params.id, 'Deleted inquiry');
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// Testimonials Routes
app.get('/api/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ created_at: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.get('/api/testimonials/published', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({ created_at: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    await logActivity('create', 'testimonial', testimonial._id, `Created testimonial from ${testimonial.author}`);
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.put('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity('update', 'testimonial', req.params.id, 'Updated testimonial');
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    await logActivity('delete', 'testimonial', req.params.id, 'Deleted testimonial');
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// FAQs Routes
app.get('/api/faqs', authMiddleware, async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ sort_order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.get('/api/faqs/published', async (req, res) => {
  try {
    const faqs = await Faq.find({ published: true }).sort({ sort_order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.post('/api/faqs', authMiddleware, async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    await logActivity('create', 'faq', faq._id, `Created FAQ: ${faq.question}`);
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

app.put('/api/faqs/:id', authMiddleware, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity('update', 'faq', req.params.id, 'Updated FAQ');
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

app.delete('/api/faqs/:id', authMiddleware, async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    await logActivity('delete', 'faq', req.params.id, 'Deleted FAQ');
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// Team Routes
app.get('/api/team', authMiddleware, async (req, res) => {
  try {
    const team = await Team.find().sort({ sort_order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

app.get('/api/team/published', async (req, res) => {
  try {
    const team = await Team.find({ published: true }).sort({ sort_order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

app.post('/api/team', authMiddleware, async (req, res) => {
  try {
    const member = await Team.create(req.body);
    await logActivity('create', 'team_member', member._id, `Created team member: ${member.name}`);
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

app.put('/api/team/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity('update', 'team_member', req.params.id, 'Updated team member');
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

app.delete('/api/team/:id', authMiddleware, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    await logActivity('delete', 'team_member', req.params.id, 'Deleted team member');
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// Settings Routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.find({});
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.key] = s.value);
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const { key, value } = req.body;
    await Settings.findOneAndUpdate({ key }, { value, updated_at: new Date() }, { upsert: true });
    await logActivity('update', 'setting', key, `Updated setting: ${key}`);
    res.json({ message: 'Setting updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const [totalProperties, totalBookings, totalInquiries, notifications] = await Promise.all([
      Property.countDocuments(),
      Booking.countDocuments(),
      Inquiry.countDocuments(),
      ActivityLog.find().sort({ created_at: -1 }).limit(5)
    ]);
    res.json({ totalProperties, totalBookings, totalInquiries, notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Categories & Amenities
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/amenities', async (req, res) => {
  try {
    const amenities = await Amenity.find();
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
