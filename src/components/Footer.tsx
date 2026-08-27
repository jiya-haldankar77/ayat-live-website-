import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import { NAV_LINKS } from '@/lib/siteData';
import { useSettings } from '@/contexts/SettingsContext';

const SERVICE_LINKS = [
  { name: 'Launch Packages', to: '/services#launch-packages' },
  { name: 'Developer Retainer', to: '/services#developer-retainer' },
  { name: 'Turnkey Home Building', to: '/services#turnkey-building' },
  { name: 'Privacy Policy', to: '/privacy' },
  { name: 'Terms of Service', to: '/terms' },
  { name: 'Admin', to: '/admin' },
];

function Logo() {
  return (
    <div className="border-2 border-white px-2 py-1 flex flex-col items-center leading-none select-none">
      <span className="text-white font-bold tracking-wider" style={{ fontSize: '13px', letterSpacing: '0.05em', fontFamily: 'serif' }}>ΔΔ¥ΔF</span>
      <span className="text-white font-semibold tracking-widest" style={{ fontSize: '7px', letterSpacing: '0.22em' }}>PROJECTS</span>
    </div>
  );
}

export default function Footer() {
  const settings = useSettings();
  const socials = [
    { icon: Instagram, href: settings.instagram },
    { icon: Linkedin, href: settings.linkedin },
    { icon: Youtube, href: settings.youtube },
  ];

  return (
    <footer className="bg-dark-400 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-5"><Logo /></div>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              Goa's premier real estate marketing company, combining cinematic storytelling, data-driven strategy, and white-glove service to deliver exceptional results.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-gold hover:border-gold/40 transition-all">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.name}><Link to={link.to} className="text-sm text-stone-400 hover:text-gold transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5">Services</h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.name}><Link to={link.to} className="text-sm text-stone-400 hover:text-gold transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-stone-400"><MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />{settings.address}</li>
              <li><a href={`tel:${settings.phone?.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-stone-400 hover:text-gold"><Phone className="w-4 h-4 text-gold flex-shrink-0" />{settings.phone}</a></li>
              <li><a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-sm text-stone-400 hover:text-gold"><Mail className="w-4 h-4 text-gold flex-shrink-0" />{settings.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">© {new Date().getFullYear()} AAYAT Projects. All rights reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 text-xs text-stone-500 hover:text-gold transition-colors group">
            Back to top
            <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/40 transition-colors"><ArrowUp className="w-3.5 h-3.5" /></span>
          </button>
        </div>
      </div>
    </footer>
  );
}
