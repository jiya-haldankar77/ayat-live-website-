import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, X, Menu, ChevronDown } from 'lucide-react';
import { NAV_LINKS, SERVICE_NAV } from '@/lib/siteData';
import { useSettings } from '@/contexts/SettingsContext';

function Logo() {
  return (
    <div className="border-2 border-stone-900 px-2 py-1 flex flex-col items-center leading-none select-none">
      <span className="text-stone-900 font-bold tracking-wider" style={{ fontSize: '13px', letterSpacing: '0.05em', fontFamily: 'serif' }}>
        ΔΔ¥ΔF
      </span>
      <span className="text-stone-900 font-semibold tracking-widest" style={{ fontSize: '7px', letterSpacing: '0.22em' }}>
        PROJECTS
      </span>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useSettings();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg shadow-lg lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6 text-stone-900" /> : <Menu className="w-6 h-6 text-stone-900" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-72 bg-white z-40 flex flex-col transition-transform duration-300 shadow-2xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-stone-100">
          <Link to="/" className="flex-shrink-0" aria-label="AAYAT Projects home">
            <Logo />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {NAV_LINKS.map((link) =>
              link.name === 'About' ? (
                <div key={link.name} className="relative">
                  <button 
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    Services
                    <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {servicesOpen && (
                    <div className="mt-1 ml-4 space-y-1">
                      {SERVICE_NAV.map((sl) => (
                        <Link 
                          key={sl.name} 
                          to={sl.to} 
                          onClick={() => setMobileOpen(false)}
                          className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${isActive(sl.to) ? 'text-gold bg-gold/5 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                        >
                          {sl.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.to} 
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(link.to) ? 'text-gold bg-gold/5' : 'text-stone-700 hover:bg-stone-50'}`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Contact info */}
          <div className="mt-8 pt-6 border-t border-stone-100 space-y-4">
            <a 
              href={`tel:${settings.phone?.replace(/\s/g, '')}`} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-gold" />
              {settings.phone}
            </a>
            <button 
              onClick={() => {
                navigate('/contact');
                setMobileOpen(false);
              }}
              className="w-full px-4 py-3 text-sm font-semibold text-stone-900 bg-gold tracking-wider uppercase rounded-lg hover:bg-gold-500 transition-colors"
            >
              BOOK CONSULTATION
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
