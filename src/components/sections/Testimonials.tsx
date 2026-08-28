import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsApi } from '@/lib/api';
import type { Testimonial } from '@/types';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    testimonialsApi.getPublished().then((data: any) => setTestimonials(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const t = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [paused, testimonials.length]);

  if (testimonials.length === 0) return null;
  const t = testimonials[active];

  return (
    <section className="bg-white py-20 md:py-24" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <p className="reveal text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">CLIENT STORIES</p>
        <h2 className="reveal font-display text-4xl md:text-5xl font-medium text-stone-900 mb-12">Why Clients Choose AAYAT</h2>
        <div className="reveal relative">
          <Quote className="w-12 h-12 text-gold/30 mx-auto mb-6" />
          <blockquote className="font-display text-xl md:text-2xl text-stone-800 leading-relaxed italic min-h-[160px] md:min-h-[140px]">"{t.quote}"</blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            {t.image && <img src={t.image} alt={t.author} className="w-14 h-14 rounded-full object-cover border-2 border-gold/20" />}
            <div className="text-left"><p className="font-display text-lg text-stone-900 font-medium">{t.author}</p>{t.role && <p className="text-sm text-stone-500">{t.role}</p>}</div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-3">
            <button onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-gold hover:text-gold transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            {testimonials.map((_, i) => <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${i === active ? 'w-8 bg-gold' : 'w-2 bg-stone-200 hover:bg-stone-300'}`} />)}
            <button onClick={() => setActive((a) => (a + 1) % testimonials.length)} className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-gold hover:text-gold transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
