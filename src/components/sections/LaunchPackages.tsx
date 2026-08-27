import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LAUNCH_PACKAGES } from '@/lib/siteData';

export default function LaunchPackages() {
  const navigate = useNavigate();
  const go = (href: string) => navigate(href);

  return (
    <section id="launch-packages" className="bg-cream py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            PROPERTY LAUNCH PACKAGES
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">
            Choose Your Launch Strategy
          </h2>
          <p className="mt-5 text-stone-600 max-w-2xl mx-auto">
            Schedule a consultation to discuss your property and discover which launch package is
            right for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {LAUNCH_PACKAGES.map((pkg, i) => (
            <div
              key={pkg.name}
              className={`reveal relative p-8 transition-all duration-500 hover:-translate-y-2 ${
                pkg.highlight
                  ? 'bg-stone-900 text-white shadow-2xl'
                  : 'bg-white border border-stone-100 shadow-sm'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-gold text-stone-900 text-xs font-bold tracking-wider uppercase">
                  <Star className="w-3 h-3 fill-stone-900" />
                  MOST POPULAR
                </div>
              )}
              <h3 className={`font-display text-2xl font-medium ${pkg.highlight ? 'text-white' : 'text-stone-900'}`}>
                {pkg.name}
              </h3>
              <p className={`text-xs mt-1 ${pkg.highlight ? 'text-stone-400' : 'text-stone-500'}`}>
                Starting from
              </p>
              <div className={`font-display text-4xl font-semibold mt-1 ${pkg.highlight ? 'text-gold' : 'text-stone-900'}`}>
                {pkg.price}
              </div>
              <p className={`mt-3 text-sm leading-relaxed ${pkg.highlight ? 'text-stone-300' : 'text-stone-600'}`}>
                {pkg.description}
              </p>

              <div className={`my-7 h-px ${pkg.highlight ? 'bg-white/10' : 'bg-stone-100'}`} />

              <ul className="space-y-3.5">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-sm ${pkg.highlight ? 'text-stone-300' : 'text-stone-700'}`}
                  >
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${pkg.highlight ? 'text-gold' : 'text-gold'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => go('/contact')}
                className={`mt-8 w-full py-3.5 text-sm font-semibold tracking-wider uppercase transition-all ${
                  pkg.highlight
                    ? 'bg-gold text-stone-900 hover:bg-gold-500'
                    : 'border border-stone-300 text-stone-900 hover:border-stone-900 hover:bg-stone-900 hover:text-white'
                }`}
              >
                Select Package
              </button>
            </div>
          ))}
        </div>

        <p className="reveal mt-10 text-center text-sm text-stone-500">
          Pricing depends on project size and complexity. Custom pricing is provided after
          evaluating the project.{' '}
          <button onClick={() => go('#contact')} className="text-gold hover:underline font-medium">
            Get a custom quote
          </button>
        </p>
      </div>
    </section>
  );
}
