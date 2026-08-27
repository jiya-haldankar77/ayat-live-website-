export type Property = {
  id: string;
  title: string;
  slug: string | null;
  location: string;
  price: string;
  price_value: number;
  price_range: string | null;
  property_type: string;
  category_id: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: string | null;
  region: string;
  description: string;
  short_description: string | null;
  features: string[];
  images: string[];
  video_url: string | null;
  brochure_url: string | null;
  status: string;
  mandate_type: string;
  featured: boolean;
  published: boolean;
  completion_date: string | null;
  latitude: number | null;
  longitude: number | null;
  map_embed_url: string | null;
  created_at: string;
};

export type PropertyWithRelations = Property & {
  category?: Category | null;
  amenities?: Amenity[];
  floorplans?: PropertyFloorplan[];
  documents?: PropertyDocument[];
  videos?: PropertyVideo[];
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  location: string;
  project_type: string;
  status: string;
  price_range: string;
  description: string;
  highlights: string[];
  amenities: string[];
  images: string[];
  video_url: string | null;
  brochure_url: string | null;
  featured: boolean;
  total_units: string | null;
  available_units: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Amenity = {
  id: string;
  name: string;
  icon: string | null;
};

export type PropertyFloorplan = {
  id: string;
  property_id: string;
  image_url: string;
  label: string | null;
  sort_order: number;
};

export type PropertyDocument = {
  id: string;
  property_id: string;
  file_url: string;
  label: string;
};

export type PropertyVideo = {
  id: string;
  property_id: string;
  video_url: string;
  label: string | null;
};

export type Booking = {
  id: string;
  property_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  notes: string | null;
  status: string;
  payment_status: string;
  created_at: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  interested_property: string | null;
  budget: string | null;
  source_page: string | null;
  status: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  image: string | null;
  published: boolean;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type Setting = {
  key: string;
  value: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string | null;
  type: string;
  read: boolean;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  action: string;
  entity: string | null;
  entity_id: string | null;
  detail: string | null;
  created_at: string;
};
