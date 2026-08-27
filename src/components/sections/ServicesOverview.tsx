import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Card = {
  title: string;
  description: string;
  href: string;
  image: string;
  colSpan?: string;
  rowSpan?: string;
  subtitle?: string;
};

const CARDS: Card[] = [
  {
    title: 'Property Launch Packages',
    description:
      'Strategic marketing campaigns that position your property for maximum impact and fastest sale.',
    href: '/services#launch-packages',
    image: 'https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colSpan: 'lg:col-span-2',
    subtitle: 'Launch Strategy',
  },
  {
    title: 'Media Production Studio',
    description:
      'Cinematic films, drone shoots, architectural photography, and compelling social content.',
    href: '/services#media-production',
    image: 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=1000',
    colSpan: 'lg:col-span-1',
    subtitle: 'Content Creation',
  },
  {
    title: 'SecureBuy™ Due Diligence',
    description:
      'Comprehensive legal and financial verification to ensure safe, secure property transactions.',
    href: '/services#securebuy',
    image: 'https://images.pexels.com/photos/5838251/pexels-photo-5838251.jpeg?auto=compress&cs=tinysrgb&w=1000',
    colSpan: 'lg:col-span-1',
    subtitle: 'Buyer Protection',
  },
  {
    title: 'Developer Solutions',
    description:
      'End-to-end marketing partnerships, CRM integration, and sales acceleration for developers.',
    href: '/services#developer-retainer',
    image: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colSpan: 'lg:col-span-2',
    subtitle: 'Partnership Model',
  },
];

export default function ServicesOverview() {
  const navigate = useNavigate();
  const go = (href: string) => navigate(href);

  return (
    <section className="bg-dark-400 py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="reveal mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            WHAT WE DO
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-white">
            Our Services
          </h2>
          <p className="mt-5 text-stone-400 leading-relaxed max-w-2xl">
            From cinematic content to data-driven campaigns, we deliver every element needed to
            position your property for success in Goa's competitive market.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {CARDS.map((card, i) => (
            <button
              key={card.title}
              onClick={() => go(card.href)}
              className={`reveal group relative overflow-hidden h-80 md:h-96 ${card.colSpan || ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-left">
                {card.subtitle && (
                  <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    {card.subtitle}
                  </p>
                )}
                <h3 className="font-display text-2xl md:text-3xl font-medium text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed max-w-md max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500">
                  {card.description}
                </p>
                <div className="flex items-center gap-2 text-gold text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
