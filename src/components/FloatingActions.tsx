import { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const settings = useSettings();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-center gap-3">
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg hover:bg-stone-700 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <a
        href={`tel:${settings.phone?.replace(/\s/g, '')}`}
        className="w-12 h-12 rounded-full bg-white text-gold border border-stone-200 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        aria-label="Call us"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href={`https://wa.me/${settings.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
