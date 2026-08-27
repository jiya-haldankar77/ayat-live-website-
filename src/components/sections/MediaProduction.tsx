import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MEDIA_SERVICES, MEDIA_PROCESS } from '@/lib/siteData';

export default function MediaProduction() {
  const navigate = useNavigate();
  const go = (href: string) => navigate(href);

  return (
    <section id="media-production" className="bg-white py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            MEDIA PRODUCTION STUDIO
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">
            Cinematic Storytelling for Luxury Real Estate
          </h2>
          <p className="mt-5 text-stone-600 max-w-2xl mx-auto">
            Our in-house production studio creates stunning visual content that captures the true
            essence of luxury real estate.
          </p>
        </div>

        {/* How We Create */}
        <div className="reveal mt-14">
          <h3 className="font-display text-xl text-stone-900 text-center mb-8">How We Create</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MEDIA_PROCESS.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="p-6 bg-cream border border-stone-100 text-center">
                  <span className="font-display text-4xl font-semibold text-gold/30">{step.step}</span>
                  <h4 className="mt-3 font-display text-lg text-stone-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
                {i < MEDIA_PROCESS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-gold/40" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEDIA_SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="reveal group bg-cream border border-stone-100 p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl font-medium text-stone-900">{service.title}</h3>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">{service.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-stone-700">
                      <Check className="w-4 h-4 text-gold flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block">Starting from</span>
                    <span className="font-display text-xl font-semibold text-gold">{service.starting}</span>
                  </div>
                  <button
                    onClick={() => go('/contact')}
                    className="text-sm text-gold hover:text-gold-500 font-medium group/btn flex items-center gap-1"
                  >
                    Book a Shoot
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-12 p-8 md:p-12 bg-stone-900 text-center">
          <h3 className="font-display text-2xl md:text-3xl text-white">Ready to Showcase Your Property?</h3>
          <p className="mt-3 text-stone-300 max-w-2xl mx-auto">
            Let's create stunning content that captures the true essence of your property and
            attracts the right buyers.
          </p>
          <button
            onClick={() => go('#contact')}
            className="mt-6 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors"
          >
            Book a Shoot
          </button>
        </div>
      </div>
    </section>
  );
}
