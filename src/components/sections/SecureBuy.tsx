import { Check, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SECUREBUY_PACKAGES,
  SECUREBUY_VERIFICATIONS,
  SECUREBUY_PROCESS,
  SECUREBUY_TRUST,
} from '@/lib/siteData';

export default function SecureBuy() {
  const navigate = useNavigate();
  const go = (href: string) => navigate(href);

  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            SECUREBUY™ DUE DILIGENCE
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">
            Your Protection is Our Priority
          </h2>
          <p className="mt-5 text-stone-600 max-w-2xl mx-auto">
            Our comprehensive due diligence service ensures your property purchase in Goa is legally
            sound, financially secure, and completely transparent.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="reveal mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECUREBUY_TRUST.map((trust, i) => (
            <div key={i} className="p-5 bg-white border border-stone-100 flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-sm text-stone-700 leading-relaxed">{trust}</p>
            </div>
          ))}
        </div>

        {/* What we verify */}
        <div className="reveal mt-16">
          <h3 className="font-display text-2xl text-stone-900 text-center mb-8">What We Verify</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECUREBUY_VERIFICATIONS.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="reveal p-6 bg-white border border-stone-100 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h4 className="font-display text-lg text-stone-900">{v.title}</h4>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packages */}
        <div className="mt-16">
          <h3 className="reveal font-display text-2xl text-stone-900 text-center mb-8">
            Choose Your Level of Protection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {SECUREBUY_PACKAGES.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`reveal relative p-8 transition-all duration-500 hover:-translate-y-2 ${
                  pkg.highlight ? 'bg-stone-900 text-white shadow-2xl' : 'bg-white border border-stone-100'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gold text-stone-900 text-xs font-bold tracking-wider uppercase">
                    RECOMMENDED
                  </div>
                )}
                <h4 className="font-display text-xl font-medium text-stone-900">{pkg.name}</h4>
                <div className="font-display text-3xl font-semibold text-gold mt-3">{pkg.price}</div>
                <p className={`mt-3 text-sm leading-relaxed ${pkg.highlight ? 'text-stone-300' : 'text-stone-600'}`}>
                  {pkg.description}
                </p>
                <span className={`mt-4 inline-block px-2.5 py-1 rounded-full text-xs ${pkg.highlight ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
                  {pkg.timeline}
                </span>

                <div className={`my-6 h-px ${pkg.highlight ? 'bg-white/10' : 'bg-stone-100'}`} />

                <ul className="space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${pkg.highlight ? 'text-stone-300' : 'text-stone-700'}`}>
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => go('/contact')}
                  className={`mt-7 w-full py-3.5 text-sm font-semibold tracking-wider uppercase transition-all ${
                    pkg.highlight
                      ? 'bg-gold text-stone-900 hover:bg-gold-500'
                      : 'border border-stone-300 text-stone-900 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  Start Due Diligence
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="reveal mt-16">
          <h3 className="font-display text-2xl text-stone-900 text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECUREBUY_PROCESS.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="p-6 bg-white border border-stone-100 text-center">
                  <span className="font-display text-4xl font-semibold text-gold/30">{step.step}</span>
                  <h4 className="mt-3 font-display text-lg text-stone-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{step.description}</p>
                </div>
                {i < SECUREBUY_PROCESS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-gold/40" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="reveal mt-12 p-8 md:p-12 bg-stone-900 text-center">
          <h3 className="font-display text-2xl md:text-3xl text-white">Don't Take Chances With Your Investment</h3>
          <p className="mt-3 text-stone-300 max-w-2xl mx-auto">
            A small investment in due diligence can save you from major headaches. Get started with
            SecureBuy™ today.
          </p>
          <button
            onClick={() => go('/contact')}
            className="mt-6 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
