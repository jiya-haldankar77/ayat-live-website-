import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import PublicLayout from '@/layouts/PublicLayout';
import ProtectedAdmin from '@/layouts/ProtectedAdmin';
import Home from '@/pages/Home';
import PropertiesPage from '@/pages/PropertiesPage';
import PropertyDetails from '@/pages/PropertyDetails';
import ProjectsPage from '@/pages/ProjectsPage';
import GalleryPage from '@/pages/GalleryPage';
import ServicesPage from '@/pages/ServicesPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ThankYou from '@/pages/ThankYou';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProperties from '@/pages/admin/AdminProperties';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminInquiries from '@/pages/admin/AdminInquiries';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminFaqs from '@/pages/admin/AdminFaqs';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminSettings from '@/pages/admin/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/property/:slug" element={<PropertyDetails />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Route>
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<ProtectedAdmin />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/faqs" element={<AdminFaqs />} />
              <Route path="/admin/team" element={<AdminTeam />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
