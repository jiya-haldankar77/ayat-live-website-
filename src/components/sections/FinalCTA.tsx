import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalCTA() {
  const navigate = useNavigate();
  const go = (href: string) => navigate(href);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="reveal">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-6">
            READY TO ELEVATE YOUR PROPERTY
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-white leading-tight text-balance">
            Strategic Marketing That
            <em className="block text-gold not-italic" style={{ fontStyle: 'italic' }}>
              Sells Luxury Properties
            </em>
          </h2>
          <p className="mt-6 text-lg text-stone-300 max-w-xl mx-auto">
            Get exclusive early access to our upcoming developments and investment opportunities.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => go('/contact')}
              className="px-8 py-4 text-sm font-semibold tracking-widest uppercase text-stone-900 bg-gold hover:bg-gold-500 inline-flex items-center gap-2 group transition-colors"
            >
              Book Free Consultation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => go('/properties')}
              className="px-8 py-4 text-sm font-semibold tracking-widest uppercase text-white border border-white/30 hover:border-white transition-colors"
            >
              View All Properties
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
