import { useState } from 'react';
import { Play, X, TrendingUp } from 'lucide-react';
import { PORTFOLIO_ITEMS, PORTFOLIO_FEATURED } from '@/lib/siteData';

const CATEGORIES = ['All Work', 'Property Launch', 'Cinematic Film', 'Developer Project', 'Photography'];

export default function Portfolio() {
  const [category, setCategory] = useState('All Work');
  const [showreelOpen, setShowreelOpen] = useState(false);

  const filtered =
    category === 'All Work'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === category);

  return (
    <section id="portfolio" className="bg-white py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            RECENT WORK
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Portfolio</h2>
          <p className="mt-5 text-stone-600 max-w-2xl mx-auto">
            Explore our collection of cinematic films, stunning photography, and successful property
            launches.
          </p>
        </div>

        {/* Showreel */}
        <div className="reveal mt-10">
          <button
            onClick={() => setShowreelOpen(true)}
            className="group relative w-full h-[320px] md:h-[440px] overflow-hidden block"
          >
            <img
              src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Showreel"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-stone-900 fill-stone-900 ml-1" />
              </span>
              <p className="mt-5 font-display text-2xl md:text-3xl text-white">Watch Our Showreel</p>
              <p className="text-sm text-stone-200 mt-1">Cinematic Storytelling for Luxury Real Estate</p>
            </div>
          </button>
        </div>

        {/* Featured media grid */}
        <div className="reveal mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PORTFOLIO_FEATURED.map((item) => (
            <div key={item.title} className="group relative overflow-hidden h-56 cursor-pointer">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              {item.video && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-stone-900 fill-stone-900 ml-0.5" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs text-gold uppercase tracking-wide">{item.type}</p>
                <p className="text-white text-sm font-medium mt-0.5">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category filters */}
        <div className="reveal mt-14 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-gold text-stone-900'
                  : 'bg-stone-50 text-stone-600 border border-stone-100 hover:border-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="reveal group bg-cream border border-stone-100 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium bg-white/90 text-gold">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-stone-900 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 mt-1">{item.client}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gold font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {item.results}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showreelOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowreelOpen(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowreelOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Showreel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-20 h-20 rounded-full bg-gold flex items-center justify-center">
                  <Play className="w-8 h-8 text-stone-900 fill-stone-900 ml-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
