import mongoose from 'mongoose';

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

// Models — use existing model if already compiled (important for serverless hot reload)
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
export const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export const Amenity = mongoose.models.Amenity || mongoose.model('Amenity', amenitySchema);
