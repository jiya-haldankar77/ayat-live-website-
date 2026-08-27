import {
  propertiesApi,
  bookingsApi,
  inquiriesApi,
  testimonialsApi,
  faqsApi,
  teamApi,
  settingsApi,
  dashboardApi,
  categoriesApi,
  amenitiesApi,
} from './api';
import type {
  Property,
  PropertyWithRelations,
  Project,
  Category,
  Amenity,
  Booking,
  ContactInquiry,
  Testimonial,
  Faq,
  TeamMember,
} from '@/types';

// Re-export API functions
export {
  propertiesApi,
  bookingsApi,
  inquiriesApi,
  testimonialsApi,
  faqsApi,
  teamApi,
  settingsApi,
  dashboardApi,
  categoriesApi,
  amenitiesApi,
};

// Mock Supabase client/object for compilation compatibility if imported elsewhere
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error('Not implemented') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

// Legacy function names for compatibility with public routes
export const fetchProperties = async (filters?: {
  type?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: string;
  search?: string;
}): Promise<Property[]> => {
  let data = await propertiesApi.getPublished();
  if (filters) {
    if (filters.type && filters.type !== 'all') {
      data = data.filter((p: Property) => p.property_type === filters.type);
    }
    if (filters.region && filters.region !== 'all') {
      data = data.filter((p: Property) => p.region === filters.region);
    }
    if (filters.beds && filters.beds !== 'all') {
      data = data.filter((p: Property) => (p.bedrooms ?? 0) >= Number(filters.beds));
    }
    if (filters.minPrice !== undefined) {
      const minVal = filters.minPrice;
      data = data.filter((p: Property) => p.price_value >= minVal);
    }
    if (filters.maxPrice !== undefined) {
      const maxVal = filters.maxPrice;
      data = data.filter((p: Property) => p.price_value < maxVal);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      data = data.filter((p: Property) =>
        p.title.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s)
      );
    }
  }
  return data;
};

export const fetchAllProperties = (): Promise<Property[]> => propertiesApi.getAll();
export const createProperty = (data: any): Promise<Property> => propertiesApi.create(data);
export const updateProperty = (id: string, data: any): Promise<Property> => propertiesApi.update(id, data);
export const deleteProperty = (id: string): Promise<any> => propertiesApi.delete(id);

export const fetchFeaturedProperties = async (limit = 3): Promise<Property[]> => {
  const properties = await propertiesApi.getPublished();
  return properties.filter((p: Property) => p.featured).slice(0, limit);
};

export const fetchPropertyBySlug = async (slug: string): Promise<PropertyWithRelations | null> => {
  const properties = await propertiesApi.getPublished();
  const property = properties.find((p: Property) => p.slug === slug);
  if (!property) return null;
  return {
    ...property,
    amenities: property.amenities || [],
    floorplans: property.floorplans || [],
    documents: property.documents || [],
    videos: property.videos || [],
  };
};

// Bookings
export const fetchAllBookings = (): Promise<Booking[]> => bookingsApi.getAll();
export const createBooking = (data: any): Promise<Booking> => bookingsApi.create(data);
export const updateBooking = (id: string, data: any): Promise<Booking> => bookingsApi.update(id, data);
export const deleteBooking = (id: string): Promise<any> => bookingsApi.delete(id);

// Inquiries
export const fetchAllInquiries = (): Promise<ContactInquiry[]> => inquiriesApi.getAll();
export const createInquiry = (data: any): Promise<ContactInquiry> => inquiriesApi.create(data);
export const updateInquiry = (id: string, data: any): Promise<ContactInquiry> => inquiriesApi.update(id, data);
export const deleteInquiry = (id: string): Promise<any> => inquiriesApi.delete(id);

// Testimonials
export const fetchTestimonials = (): Promise<Testimonial[]> => testimonialsApi.getPublished();
export const fetchAllTestimonials = (): Promise<Testimonial[]> => testimonialsApi.getAll();
export const createTestimonial = (data: any): Promise<Testimonial> => testimonialsApi.create(data);
export const updateTestimonial = (id: string, data: any): Promise<Testimonial> => testimonialsApi.update(id, data);
export const deleteTestimonial = (id: string): Promise<any> => testimonialsApi.delete(id);

// FAQs
export const fetchFaqs = (): Promise<Faq[]> => faqsApi.getPublished();
export const fetchAllFaqs = (): Promise<Faq[]> => faqsApi.getAll();
export const createFaq = (data: any): Promise<Faq> => faqsApi.create(data);
export const updateFaq = (id: string, data: any): Promise<Faq> => faqsApi.update(id, data);
export const deleteFaq = (id: string): Promise<any> => faqsApi.delete(id);

// Team
export const fetchTeam = (): Promise<TeamMember[]> => teamApi.getPublished();
export const fetchAllTeam = (): Promise<TeamMember[]> => teamApi.getAll();
export const createTeamMember = (data: any): Promise<TeamMember> => teamApi.create(data);
export const updateTeamMember = (id: string, data: any): Promise<TeamMember> => teamApi.update(id, data);
export const deleteTeamMember = (id: string): Promise<any> => teamApi.delete(id);

// Settings
export const fetchSettings = (): Promise<Record<string, string>> => settingsApi.getAll();
export const updateSetting = (key: string, value: string): Promise<any> => settingsApi.update(key, value);

// Stats, Categories, Amenities
export const fetchAdminDashboardStats = (): Promise<any> => dashboardApi.getStats();
export const fetchCategories = (): Promise<Category[]> => categoriesApi.getAll();
export const fetchAmenities = (): Promise<Amenity[]> => amenitiesApi.getAll();

// Mock Image Upload
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string> => {
  return URL.createObjectURL(file);
};
export const deleteImage = async (bucket: string, path: string): Promise<void> => {
  return;
};

// Mock Projects
export const fetchProjects = async (): Promise<Project[]> => {
  return [
    {
      id: 'project-1',
      name: 'Aayat Vasant',
      tagline: 'Modern tropical luxury villas',
      location: 'Assagao, Goa',
      project_type: 'villa',
      status: 'under_construction',
      price_range: '₹6.5 Cr - ₹8.5 Cr',
      description: 'An exclusive collection of 4-bedroom modern tropical villas nestled in the premium valley of Assagao. Featuring private swimming pools, high double-height ceilings, and premium design finishes.',
      highlights: ['4 BHK Luxury Villas', 'Private Pool & Deck', 'Assagao Prime Location', '100% Power Backup'],
      amenities: ['Private Pool', '24/7 Security', 'Lush Gardens', 'Staff Quarters'],
      images: ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800'],
      video_url: null,
      brochure_url: null,
      featured: true,
      total_units: '6',
      available_units: '3',
      created_at: new Date().toISOString(),
    },
    {
      id: 'project-2',
      name: 'Aayat Ananta',
      tagline: 'Stunning sunset view residences',
      location: 'Siolim, Goa',
      project_type: 'villa',
      status: 'planning',
      price_range: '₹5.2 Cr - ₹7.0 Cr',
      description: 'Overlooking the serene backwaters of Siolim, Aayat Ananta offers luxury sunset-view residences designed with colonial architecture charm combined with state-of-the-art modern interiors.',
      highlights: ['Colonial Portuguese Architecture', 'Sunset View Decks', 'Private Lift', 'Fully Loaded Kitchen'],
      amenities: ['Gym', 'Clubhouse', 'Infinity Pool', 'Car Parking'],
      images: ['https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'],
      video_url: null,
      brochure_url: null,
      featured: true,
      total_units: '8',
      available_units: '8',
      created_at: new Date().toISOString(),
    },
  ];
};
