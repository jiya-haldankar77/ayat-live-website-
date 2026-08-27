import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex-shrink-0" aria-label="AAYAT Projects home">
          <Logo />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.name === 'Services' ? (
              <div key={link.name} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                <button className="flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
                  Services
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-stone-100 shadow-xl py-1 z-50">
                    {SERVICE_NAV.map((sl) => (
                      <Link key={sl.name} to={sl.to} className="block px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900">
                        {sl.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.name} to={link.to} className={`text-sm font-medium transition-colors ${isActive(link.to) ? 'text-gold' : 'text-stone-700 hover:text-stone-900'}`}>
                {link.name}
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <a href={`tel:${settings.phone?.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900">
            <Phone className="w-4 h-4" />
            {settings.phone}
          </a>
          <Link to="/admin" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
            Admin
          </Link>
          <button onClick={() => navigate('/contact')} className="px-5 py-2.5 text-sm font-semibold text-stone-900 bg-gold tracking-wider uppercase hover:bg-gold-500 transition-colors">
            BOOK CONSULTATION
          </button>
        </div>

        <button className="lg:hidden p-2 text-stone-900" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 py-4 px-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} to={link.to} className={`text-sm font-medium py-2.5 ${isActive(link.to) ? 'text-gold' : 'text-stone-700'}`}>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-stone-100 pt-3 mt-2 flex flex-col gap-3">
            <a href={`tel:${settings.phone?.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-stone-700">
              <Phone className="w-4 h-4" />
              {settings.phone}
            </a>
            <Link to="/admin" className="text-sm font-medium text-stone-600 py-2.5">
              Admin
            </Link>
            <button onClick={() => navigate('/contact')} className="px-5 py-2.5 text-sm font-semibold text-stone-900 bg-gold tracking-wider uppercase text-center">
              BOOK CONSULTATION
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
