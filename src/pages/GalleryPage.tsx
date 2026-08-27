import { useState } from 'react';
import { X, Play } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const GALLERY = [
  { src: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Villas' },
  { src: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Villas' },
  { src: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Interiors' },
  { src: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Architecture' },
  { src: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Architecture' },
  { src: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Developments' },
  { src: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Interiors' },
  { src: 'https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Media' },
  { src: 'https://images.pexels.com/photos/5838251/pexels-photo-5838251.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Media' },
  { src: 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Media' },
  { src: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Architecture' },
  { src: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'Villas' },
];

const CATEGORIES = ['All', 'Villas', 'Interiors', 'Architecture', 'Developments', 'Media'];

export default function GalleryPage() {
  useScrollReveal();
  const [category, setCategory] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = category === 'All' ? GALLERY : GALLERY.filter((g) => g.category === category);

  return (
    <div className="bg-white pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-10">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">VISUAL SHOWCASE</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Gallery</h1>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">Explore our collection of cinematic films, stunning photography, and architectural highlights.</p>
        </div>

        <div className="reveal flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2.5 text-sm font-medium transition-all ${category === cat ? 'bg-gold text-stone-900' : 'bg-cream text-stone-600 border border-stone-100 hover:border-stone-300'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <button key={i} onClick={() => setLightbox(item.src)} className="reveal group relative overflow-hidden aspect-square" style={{ transitionDelay: `${i * 40}ms` }}>
              <img src={item.src} alt={item.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-medium bg-white/90 text-stone-700">{item.category}</span>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><X className="w-5 h-5" /></button>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
