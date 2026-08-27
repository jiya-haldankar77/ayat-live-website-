import { useEffect, useState } from 'react';
import { MapPin, Check, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '@/lib/services';
import type { Project } from '@/types';
import { PROJECT_STATUS_LABELS } from '@/lib/siteData';

export default function OurProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects().then((data) => { setProjects(data.slice(0, 4)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const go = (href: string) => navigate(href);

  const statusStyle = (s: string) => {
    if (s === 'completed') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (s === 'under_construction') return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    return 'bg-violet-500/15 text-violet-400 border-violet-500/30';
  };

  return (
    <section className="bg-dark-400 py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">
            SIGNATURE PROJECTS
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-white">
            Our Projects
          </h2>
          <p className="mt-5 text-stone-400 leading-relaxed max-w-2xl">
            Beyond marketing excellence, we develop and curate exceptional properties that set new
            benchmarks for luxury living in Goa.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-dark-200 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, i) => (
              <div
                key={project.id}
                className={`reveal grid lg:grid-cols-2 gap-8 items-center bg-dark-200 overflow-hidden group ${
                  i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative h-64 lg:h-[380px] overflow-hidden">
                  <img
                    src={project.images?.[0] || 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium border backdrop-blur-sm ${statusStyle(project.status)}`}>
                    {PROJECT_STATUS_LABELS[project.status] || project.status}
                  </span>
                </div>

                <div className="p-7 md:p-10">
                  <p className="text-gold text-xs font-semibold tracking-wider uppercase mb-2">
                    {project.price_range}
                  </p>
                  <h3 className="font-display text-3xl font-medium text-white">{project.name}</h3>
                  <p className="mt-1 text-stone-400 text-sm italic">{project.tagline}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-stone-400">
                    <MapPin className="w-4 h-4 text-gold" />
                    {project.location}
                  </p>
                  <p className="mt-4 text-stone-400 leading-relaxed text-sm line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {project.highlights?.slice(0, 4).map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-stone-300">
                        <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-6 text-sm">
                    {project.total_units && (
                      <div>
                        <span className="text-stone-500 text-xs block">Total Units</span>
                        <span className="text-white font-medium">{project.total_units}</span>
                      </div>
                    )}
                    {project.available_units && (
                      <div>
                        <span className="text-stone-500 text-xs block">Available</span>
                        <span className="text-gold font-medium">{project.available_units}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => { setSelected(project); setActiveImg(0); }}
                    className="mt-7 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-300 group/btn"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="reveal mt-12 text-center">
            <button
              onClick={() => go('/contact')}
              className="px-8 py-4 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors"
            >
              Register Your Interest
            </button>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="relative w-full max-w-5xl bg-dark-300 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative h-72 md:h-[440px] overflow-hidden">
              <img
                src={selected.images?.[activeImg] || selected.images?.[0]}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
            </div>
            {selected.images?.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-dark-200">
                {selected.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-16 overflow-hidden flex-shrink-0 border-2 ${activeImg === i ? 'border-gold' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="p-6 md:p-10">
              <p className="text-gold text-xs font-semibold tracking-wider uppercase mb-1">{selected.price_range}</p>
              <h2 className="font-display text-3xl font-medium text-white">{selected.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-stone-400 text-sm">
                <MapPin className="w-4 h-4 text-gold" />
                {selected.location}
              </p>
              <p className="mt-5 text-stone-400 leading-relaxed">{selected.description}</p>

              <h3 className="font-display text-xl text-white mt-6 mb-3">Key Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {selected.highlights?.map((h) => (
                  <div key={h} className="flex items-center gap-2.5 text-sm text-stone-300">
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                    {h}
                  </div>
                ))}
              </div>

              {selected.amenities?.length > 0 && (
                <>
                  <h3 className="font-display text-xl text-white mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selected.amenities.map((a) => (
                      <span key={a} className="px-3 py-1.5 text-xs rounded-full bg-white/5 text-stone-300 border border-white/10">
                        {a}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <a
                href={`https://wa.me/919145450039?text=${encodeURIComponent(`I'm interested in ${selected.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 text-center transition-colors"
              >
                Inquire About This Project
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
