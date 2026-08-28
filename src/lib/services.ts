import { createClient } from '@supabase/supabase-js';
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
  Setting,
  Notification,
} from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// ---------- Properties ----------
export async function fetchProperties(filters?: {
  type?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: string;
  search?: string;
}): Promise<Property[]> {
  let q = supabase.from('properties').select('*').eq('published', true).order('featured', { ascending: false }).order('created_at', { ascending: false });
  if (filters?.type && filters.type !== 'all') q = q.eq('property_type', filters.type);
  if (filters?.region && filters.region !== 'all') q = q.eq('region', filters.region);
  if (filters?.beds && filters.beds !== 'all') q = q.gte('bedrooms', Number(filters.beds));
  if (filters?.minPrice) q = q.gte('price_value', filters.minPrice);
  if (filters?.maxPrice) q = q.lt('price_value', filters.maxPrice);
  if (filters?.search) q = q.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
  const { data, error } = await q;
  if (error) throw error;
  return data as Property[];
}

export async function fetchPropertyBySlug(slug: string): Promise<PropertyWithRelations | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error || !data) return null;
  const property = data as PropertyWithRelations;

  const [amn, fp, docs, vids] = await Promise.all([
    supabase.from('property_amenities').select('amenity:amenities(*)').eq('property_id', property.id),
    supabase.from('property_floorplans').select('*').eq('property_id', property.id).order('sort_order'),
    supabase.from('property_documents').select('*').eq('property_id', property.id),
    supabase.from('property_videos').select('*').eq('property_id', property.id),
  ]);

  property.amenities = (amn.data as unknown as { amenity: Amenity }[] | null)?.map((r) => r.amenity) ?? [];
  property.floorplans = (fp.data as unknown as PropertyWithRelations['floorplans']) ?? [];
  property.documents = (docs.data as unknown as PropertyWithRelations['documents']) ?? [];
  property.videos = (vids.data as unknown as PropertyWithRelations['videos']) ?? [];
  return property;
}

export async function fetchFeaturedProperties(limit = 3): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as Property[]) ?? [];
}

// ---------- Projects ----------
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false });
  if (error) throw error;
  return data as Project[];
}

// ---------- Categories & Amenities ----------
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').order('name');
  return (data as Category[]) ?? [];
}

// ---------- Amenities ----------
export async function fetchAmenities(): Promise<Amenity[]> {
  const { data } = await supabase.from('amenities').select('*').order('name');
  return (data as Amenity[]) ?? [];
}

// ---------- Bookings ----------
export async function createBooking(input: Omit<Booking, 'id' | 'created_at' | 'status' | 'payment_status'>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...input, status: 'pending', payment_status: 'unpaid' })
    .select()
    .single();
  if (error) throw error;
  await supabase.from('notifications').insert({ title: 'New booking request', body: `${input.customer_name} booked a visit`, type: 'booking' });
  return data as Booking;
}

// ---------- Inquiries ----------
export async function createInquiry(input: Omit<ContactInquiry, 'id' | 'created_at' | 'status'>): Promise<ContactInquiry> {
  const { data, error } = await supabase
    .from('contact_inquiries')
    .insert({ ...input, status: 'new' })
    .select()
    .single();
  if (error) throw error;
  await supabase.from('notifications').insert({ title: 'New inquiry received', body: `${input.name} sent a message`, type: 'inquiry' });
  return data as ContactInquiry;
}

// ---------- Testimonials ----------
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data } = await supabase.from('testimonials').select('*').eq('published', true).order('created_at', { ascending: false });
  return (data as Testimonial[]) ?? [];
}

// ---------- FAQs ----------
export async function fetchFaqs(): Promise<Faq[]> {
  const { data } = await supabase.from('faqs').select('*').eq('published', true).order('sort_order');
  return (data as Faq[]) ?? [];
}

// ---------- Team ----------
export async function fetchTeam(): Promise<TeamMember[]> {
  const { data } = await supabase.from('team_members').select('*').eq('published', true).order('sort_order');
  return (data as TeamMember[]) ?? [];
}

// ---------- Settings ----------
export async function fetchSettings(): Promise<Record<string, string>> {
  const { data } = await supabase.from('settings').select('*');
  const map: Record<string, string> = {};
  (data as Setting[] | null)?.forEach((s) => (map[s.key] = s.value));
  return map;
}

// ---------- Admin helpers ----------
export async function fetchAdminDashboardStats() {
  const [props, books, inqs, notifs] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }),
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5),
  ]);
  return {
    totalProperties: props.count ?? 0,
    totalBookings: books.count ?? 0,
    totalInquiries: inqs.count ?? 0,
    notifications: (notifs.data as Notification[]) ?? [],
  };
}

// ---------- Admin Property CRUD ----------
export async function createProperty(property: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'create', 
    entity: 'property', 
    entity_id: data.id, 
    detail: `Created property: ${data.title}` 
  });
  return data as Property;
}

export async function updateProperty(id: string, property: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'update', 
    entity: 'property', 
    entity_id: id, 
    detail: `Updated property: ${data.title}` 
  });
  return data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'delete', 
    entity: 'property', 
    entity_id: id, 
    detail: 'Deleted property' 
  });
}

export async function fetchAllProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Property[];
}

// ---------- Admin Booking CRUD ----------
export async function fetchAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, property:properties(title, location)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Booking[];
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'update', 
    entity: 'booking', 
    entity_id: id, 
    detail: `Updated booking status to ${updates.status}` 
  });
  return data as Booking;
}

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'delete', 
    entity: 'booking', 
    entity_id: id, 
    detail: 'Deleted booking' 
  });
}

// ---------- Admin Inquiry CRUD ----------
export async function fetchAllInquiries(): Promise<ContactInquiry[]> {
  const { data, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as ContactInquiry[];
}

export async function updateInquiry(id: string, updates: Partial<ContactInquiry>): Promise<ContactInquiry> {
  const { data, error } = await supabase
    .from('contact_inquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'update', 
    entity: 'inquiry', 
    entity_id: id, 
    detail: `Updated inquiry status to ${updates.status}` 
  });
  return data as ContactInquiry;
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'delete', 
    entity: 'inquiry', 
    entity_id: id, 
    detail: 'Deleted inquiry' 
  });
}

// ---------- Admin Testimonial CRUD ----------
export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Testimonial[];
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'create', 
    entity: 'testimonial', 
    entity_id: data.id, 
    detail: `Created testimonial from ${testimonial.author}` 
  });
  return data as Testimonial;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'update', 
    entity: 'testimonial', 
    entity_id: id, 
    detail: 'Updated testimonial' 
  });
  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'delete', 
    entity: 'testimonial', 
    entity_id: id, 
    detail: 'Deleted testimonial' 
  });
}

// ---------- Admin FAQ CRUD ----------
export async function fetchAllFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data as Faq[];
}

export async function createFaq(faq: Omit<Faq, 'id' | 'created_at'>): Promise<Faq> {
  const { data, error } = await supabase
    .from('faqs')
    .insert(faq)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'create', 
    entity: 'faq', 
    entity_id: data.id, 
    detail: `Created FAQ: ${faq.question}` 
  });
  return data as Faq;
}

export async function updateFaq(id: string, updates: Partial<Faq>): Promise<Faq> {
  const { data, error } = await supabase
    .from('faqs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'update', 
    entity: 'faq', 
    entity_id: id, 
    detail: 'Updated FAQ' 
  });
  return data as Faq;
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'delete', 
    entity: 'faq', 
    entity_id: id, 
    detail: 'Deleted FAQ' 
  });
}

// ---------- Admin Team CRUD ----------
export async function fetchAllTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data as TeamMember[];
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | 'created_at'>): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .insert(member)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'create', 
    entity: 'team_member', 
    entity_id: data.id, 
    detail: `Created team member: ${member.name}` 
  });
  return data as TeamMember;
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'update', 
    entity: 'team_member', 
    entity_id: id, 
    detail: 'Updated team member' 
  });
  return data as TeamMember;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'delete', 
    entity: 'team_member', 
    entity_id: id, 
    detail: 'Deleted team member' 
  });
}

// ---------- Admin Settings CRUD ----------
export async function updateSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
  await supabase.rpc('log_activity', { 
    action: 'update', 
    entity: 'setting', 
    entity_id: key, 
    detail: `Updated setting: ${key}` 
  });
}

// ---------- Image Upload ----------
export async function uploadImage(file: File, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
  return publicUrl;
}

export async function deleteImage(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  if (error) throw error;
}
