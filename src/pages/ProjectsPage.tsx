import OurProjects from '@/components/sections/OurProjects';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ProjectsPage() {
  useScrollReveal();
  return (
    <div className="bg-white pt-16">
      <div className="bg-cream py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">SIGNATURE PROJECTS</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Our Projects</h1>
          <p className="mt-5 text-stone-600 leading-relaxed">Beyond marketing excellence, we develop and curate exceptional properties that set new benchmarks for luxury living in Goa.</p>
        </div>
      </div>
      <OurProjects />
    </div>
  );
}
