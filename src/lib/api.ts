// API Base URL - empty for Vercel (same domain), set for local development
const API_URL = import.meta.env.VITE_API_URL || '';

// Helper function for API calls
async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  } as HeadersInit;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<any> => {
    const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },
  
  logout: (): void => {
    localStorage.removeItem('admin_token');
  },
  
  me: async (): Promise<any> => {
    return apiCall('/api/auth/me');
  },
};

// Properties API
export const propertiesApi = {
  getAll: (): Promise<any[]> => apiCall('/api/properties'),
  getPublished: (): Promise<any[]> => apiCall('/api/properties/published'),
  create: (data: any): Promise<any> => apiCall('/api/properties', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any): Promise<any> => apiCall(`/api/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<any> => apiCall(`/api/properties/${id}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingsApi = {
  getAll: (): Promise<any[]> => apiCall('/api/bookings'),
  create: (data: any): Promise<any> => apiCall('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any): Promise<any> => apiCall(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<any> => apiCall(`/api/bookings/${id}`, { method: 'DELETE' }),
};

// Inquiries API
export const inquiriesApi = {
  getAll: (): Promise<any[]> => apiCall('/api/inquiries'),
  create: (data: any): Promise<any> => apiCall('/api/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any): Promise<any> => apiCall(`/api/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<any> => apiCall(`/api/inquiries/${id}`, { method: 'DELETE' }),
};

// Testimonials API
export const testimonialsApi = {
  getAll: (): Promise<any[]> => apiCall('/api/testimonials'),
  getPublished: (): Promise<any[]> => apiCall('/api/testimonials/published'),
  create: (data: any): Promise<any> => apiCall('/api/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any): Promise<any> => apiCall(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<any> => apiCall(`/api/testimonials/${id}`, { method: 'DELETE' }),
};

// FAQs API
export const faqsApi = {
  getAll: (): Promise<any[]> => apiCall('/api/faqs'),
  getPublished: (): Promise<any[]> => apiCall('/api/faqs/published'),
  create: (data: any): Promise<any> => apiCall('/api/faqs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any): Promise<any> => apiCall(`/api/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<any> => apiCall(`/api/faqs/${id}`, { method: 'DELETE' }),
};

// Team API
export const teamApi = {
  getAll: (): Promise<any[]> => apiCall('/api/team'),
  getPublished: (): Promise<any[]> => apiCall('/api/team/published'),
  create: (data: any): Promise<any> => apiCall('/api/team', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any): Promise<any> => apiCall(`/api/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<any> => apiCall(`/api/team/${id}`, { method: 'DELETE' }),
};

// Settings API
export const settingsApi = {
  getAll: (): Promise<any> => apiCall('/api/config/settings'),
  update: (key: string, value: string): Promise<any> => apiCall('/api/config/settings', { method: 'PUT', body: JSON.stringify({ key, value }) }),
};

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<any> => apiCall('/api/dashboard/stats'),
};

// Categories & Amenities API
export const categoriesApi = {
  getAll: (): Promise<any[]> => apiCall('/api/config/categories'),
};

export const amenitiesApi = {
  getAll: (): Promise<any[]> => apiCall('/api/config/amenities'),
};
