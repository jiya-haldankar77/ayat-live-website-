import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayat';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);


// Schemas
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

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: String,
  updated_at: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Faq = mongoose.model('Faq', faqSchema);
const Settings = mongoose.model('Settings', settingsSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Property.deleteMany({});
    await Testimonial.deleteMany({});
    await Faq.deleteMany({});
    await Settings.deleteMany({});

    // Seed Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      email: 'admin@aayatprojects.in',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✓ Admin user seeded');


    // Seed Properties
    const properties = [
      {
        title: 'Villa Serenity',
        slug: 'villa-serenity',
        location: 'Anjuna, North Goa',
        price: '₹4.5 Cr',
        price_value: 45000000,
        property_type: 'villa',
        bedrooms: 4,
        bathrooms: 4,
        area_sqft: '3500',
        region: 'north',
        description: 'A stunning 4-bedroom villa with panoramic sea views, private pool, and contemporary design.',
        short_description: 'Luxury villa with sea views in Anjuna',
        features: ['Private Pool', 'Sea View', 'Garden', 'Parking'],
        images: ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800'],
        status: 'available',
        mandate_type: 'exclusive',
        featured: true,
        published: true
      },
      {
        title: 'Coastal Heights',
        slug: 'coastal-heights',
        location: 'Vagator, North Goa',
        price: '₹3.2 Cr',
        price_value: 32000000,
        property_type: 'villa',
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: '2800',
        region: 'north',
        description: 'Modern 3-bedroom villa with infinity pool and sunset views.',
        short_description: 'Modern villa with infinity pool',
        features: ['Infinity Pool', 'Sunset View', 'Terrace', 'Security'],
        images: ['https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'],
        status: 'available',
        mandate_type: 'open',
        featured: true,
        published: true
      },
      {
        title: 'Palm Grove Estate',
        slug: 'palm-grove-estate',
        location: 'Porvorim, North Goa',
        price: '₹5.8 Cr',
        price_value: 58000000,
        property_type: 'villa',
        bedrooms: 5,
        bathrooms: 5,
        area_sqft: '4500',
        region: 'north',
        description: 'Exclusive 5-bedroom estate surrounded by coconut palms with resort-style amenities.',
        short_description: 'Exclusive estate with resort amenities',
        features: ['Resort-style Pool', 'Coconut Grove', 'Home Theater', 'Gym'],
        images: ['https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800'],
        status: 'available',
        mandate_type: 'exclusive',
        featured: true,
        published: true
      }
    ];

    await Property.insertMany(properties);
    console.log('✓ Properties seeded');

    // Seed Testimonials
    const testimonials = [
      {
        quote: 'AAYAT transformed our property launch into a cinematic experience. The attention to detail and strategic marketing approach resulted in a sale within 30 days at our asking price.',
        author: 'Rajesh Malhotra',
        role: 'Property Developer, Anjuna',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        published: true
      },
      {
        quote: 'The SecureBuy process gave us complete peace of mind. As NRIs, we were nervous about purchasing remotely, but AAYAT\'s due diligence was thorough and professional.',
        author: 'Priya & Arjun Nair',
        role: 'Buyers from Dubai',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        published: true
      },
      {
        quote: 'Their media production quality is unmatched. The drone footage and cinematic film they created for our villa project generated more inquiries than any other marketing we\'ve done.',
        author: 'Sandeep Verma',
        role: 'MD, Verma Constructions',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
        published: true
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('✓ Testimonials seeded');

    // Seed FAQs
    const faqs = [
      {
        question: 'What services does AAYAT provide?',
        answer: 'AAYAT provides comprehensive real estate services including property launch packages, media production, due diligence through SecureBuy™, developer partnerships, and turnkey construction services.',
        sort_order: 1,
        published: true
      },
      {
        question: 'How does the SecureBuy™ due diligence process work?',
        answer: 'SecureBuy™ provides comprehensive legal and financial verification of properties. We conduct title searches, compliance checks, and risk assessments to ensure your property transaction is safe and secure.',
        sort_order: 2,
        published: true
      },
      {
        question: 'What areas does AAYAT serve?',
        answer: 'We primarily serve Goa, India, with a focus on North Goa and South Goa properties. Our team has extensive local knowledge and experience in the Goan real estate market.',
        sort_order: 3,
        published: true
      },
      {
        question: 'How long does a property launch campaign typically run?',
        answer: 'Our launch packages range from 30 days for the Pilot Launch to 90 days for the Exclusive Digital Mandate. The duration depends on your goals and the package selected.',
        sort_order: 4,
        published: true
      }
    ];

    await Faq.insertMany(faqs);
    console.log('✓ FAQs seeded');

    // Seed Settings
    const settings = [
      { key: 'hero_title', value: 'Where Vision Meets' },
      { key: 'hero_subtitle', value: 'Exceptional Living' },
      { key: 'hero_description', value: 'Aayat Projects is a full-service design and development studio delivering architecture, interior design, project management, construction supervision, and turnkey villa solutions across Goa.' },
      { key: 'phone', value: '+91 914545 0039' },
      { key: 'email', value: 'hello@aayatprojects.in' },
      { key: 'address', value: 'Porvorim, Sangolda, Goa 403521' },
      { key: 'whatsapp', value: '919145450039' },
      { key: 'instagram', value: 'https://instagram.com' },
      { key: 'linkedin', value: 'https://linkedin.com' },
      { key: 'youtube', value: 'https://youtube.com' }
    ];

    await Settings.insertMany(settings);
    console.log('✓ Settings seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
