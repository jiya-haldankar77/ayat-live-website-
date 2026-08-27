import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarDays, Mail, Star, HelpCircle, Users, Settings, LogOut, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NAV = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Properties', to: '/admin/properties', icon: Building2 },
  { name: 'Bookings', to: '/admin/bookings', icon: CalendarDays },
  { name: 'Inquiries', to: '/admin/inquiries', icon: Mail },
  { name: 'Testimonials', to: '/admin/testimonials', icon: Star },
  { name: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
  { name: 'Team', to: '/admin/team', icon: Users },
  { name: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const isActive = (to: string) => location.pathname === to || (to !== '/admin/dashboard' && location.pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-dark-400 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <Link to="/admin/dashboard" className="flex items-center">
            <div className="border-2 border-white px-2 py-1 flex flex-col items-center leading-none">
              <span className="text-white font-bold tracking-wider" style={{ fontFamily: 'serif', fontSize: '13px' }}>ΔΔ¥ΔF</span>
              <span className="text-white font-semibold tracking-widest" style={{ fontSize: '7px' }}>PROJECTS</span>
            </div>
          </Link>
          <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => { const Icon = item.icon; return (
            <Link key={item.name} to={item.to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${isActive(item.to) ? 'bg-gold text-stone-900 font-medium' : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon className="w-4 h-4" /> {item.name}
            </Link>
          ); })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-sm text-stone-400 hover:text-white w-full rounded-lg hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-100 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5 text-stone-700" /></button>
            <h1 className="font-display text-lg text-stone-900">{NAV.find((n) => isActive(n.to))?.name || 'Admin'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-stone-500 hover:text-gold">View Site →</Link>
            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold"><Bell className="w-4 h-4" /></div>
            <div className="text-sm text-stone-600 hidden md:block">{user?.email}</div>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
