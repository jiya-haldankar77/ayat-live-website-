import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEVELOPER_AUDIENCE } from '@/lib/siteData';

export default function DeveloperRetainer() {
  const navigate = useNavigate();
  const go = (href: string) => navigate(href);

  return (
    <section id="developer-retainer" className="bg-white py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="reveal relative overflow-hidden">
          <img
            src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="Developer projects"
            className="w-full h-[460px] object-cover"
          />
        </div>

        <div className="reveal">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            DEVELOPER SOLUTIONS
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900 leading-tight">
            Developer Project Launch Retainer
          </h2>
          <p className="mt-5 text-stone-600 leading-relaxed">
            A comprehensive partnership model designed for developers launching multiple units or
            entire projects. We become your dedicated marketing and sales engine.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              'Digital infrastructure setup',
              'Lead management dashboard',
              'Monthly performance dashboards',
              'Premium listing placements',
              'WhatsApp lead automation',
              'Dedicated account team',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-stone-700">
                <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-cream border border-stone-100">
            <p className="text-xs text-gold font-semibold tracking-wider uppercase mb-3">
              Who This Service Is Designed For
            </p>
            <div className="flex flex-wrap gap-2">
              {DEVELOPER_AUDIENCE.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1.5 text-xs rounded-full bg-white text-stone-700 border border-stone-200"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => go('/contact')}
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors group"
          >
            Discuss Partnership
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
