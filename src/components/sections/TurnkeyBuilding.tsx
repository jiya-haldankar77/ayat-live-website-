import { Check, ArrowRight, Compass, Ruler, Hammer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TURNKEY_PACKAGES } from '@/lib/siteData';

const PROCESS = [
  { icon: Compass, title: 'Design & Planning', desc: 'Design guidance and planning support.' },
  { icon: Ruler, title: 'Construction Supervision', desc: 'AAYAT supervises the construction process.' },
  { icon: Hammer, title: 'Concept to Handover', desc: 'AAYAT manages the entire project from concept to handover.' },
];

export default function TurnkeyBuilding() {
  const navigate = useNavigate();
  const go = (href: string) => navigate(href);

  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            TURNKEY HOME BUILDING
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">
            From Land to Legacy
          </h2>
          <p className="mt-5 text-stone-600 max-w-2xl mx-auto">
            From land evaluation to final handover — Aayat Projects manages the entire construction
            journey as your single point of responsibility.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="reveal relative overflow-hidden group">
            <img
              src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Turnkey construction"
              className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="space-y-4">
            {TURNKEY_PACKAGES.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`reveal p-7 transition-all duration-500 hover:-translate-y-1 ${
                  pkg.highlight ? 'bg-stone-900 text-white' : 'bg-white border border-stone-100'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-1 w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                      pkg.highlight ? 'bg-gold text-stone-900' : 'bg-gold/10 text-gold'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className={`font-display text-xl ${pkg.highlight ? 'text-white' : 'text-stone-900'}`}>
                      {pkg.name}
                    </h3>
                    <p className={`mt-1.5 text-sm ${pkg.highlight ? 'text-stone-300' : 'text-stone-600'}`}>
                      {pkg.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="reveal pt-4">
              <div className="grid grid-cols-3 gap-3">
                {PROCESS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.title} className="p-4 bg-white border border-stone-100 text-center">
                      <Icon className="w-5 h-5 text-gold mx-auto mb-2" />
                      <p className="text-xs text-stone-700 font-medium">{s.title}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => go('/contact')}
                className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors group"
              >
                Discuss Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
