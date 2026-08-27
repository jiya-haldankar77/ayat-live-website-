import About from '@/components/sections/About';
import StatsBar from '@/components/sections/StatsBar';
import Testimonials from '@/components/sections/Testimonials';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AboutPage() {
  useScrollReveal();
  return (
    <div className="bg-white pt-16">
      <div className="bg-cream py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">ABOUT US</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Our Story</h1>
          <p className="mt-5 text-stone-600 leading-relaxed">AAYAT represents the finest properties in Goa and partners with the region's top developers. Our in-house studio, dedicated marketing team, and proprietary technology platform make us the complete solution for luxury real estate.</p>
        </div>
      </div>
      <About />
      <StatsBar />
      <Testimonials />
    </div>
  );
}
