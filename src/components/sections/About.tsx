import { useEffect, useState } from 'react';
import { Target, Eye, Heart, Award } from 'lucide-react';
import { VALUES, STATS } from '@/lib/siteData';
import { teamApi } from '@/lib/api';
import type { TeamMember } from '@/types';

const VALUE_ICONS: Record<string, typeof Target> = { precision: Target, transparency: Eye, passion: Heart };

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    teamApi.getPublished().then((data: any) => setTeam(data)).catch(() => {});
  }, []);

  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal relative overflow-hidden group">
            <img src="https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=900" alt="AAYAT Office" className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur">
              <p className="text-gold text-xs font-semibold tracking-wider uppercase">Marketing Agency 2020</p>
              <p className="text-stone-900 font-display text-lg mt-1">Built on Vision, Driven by Results</p>
            </div>
          </div>
          <div className="reveal space-y-5">
            <div><span className="text-gold text-xs font-semibold tracking-widest2 uppercase">Founded in 2019</span><h3 className="mt-3 font-display text-2xl text-stone-900">Redefining Luxury Real Estate Marketing</h3></div>
            <p className="text-stone-600 leading-relaxed">AAYAT was founded in 2019 with a simple observation: Goa's luxury properties deserved better marketing. Too many exceptional homes were being sold with mediocre photos, no video, and zero strategy.</p>
            <p className="text-stone-600 leading-relaxed">AAYAT to change that. By combining world-class media production with sophisticated digital marketing and genuine real estate expertise, we've helped sellers achieve premium prices and faster sales.</p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {STATS.slice(0, 3).map((s) => <div key={s.label} className="text-center p-4 bg-white border border-stone-100"><div className="font-display text-2xl font-semibold text-gold">{s.value}</div><div className="text-xs text-stone-500 mt-1">{s.label}</div></div>)}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h3 className="reveal font-display text-2xl text-stone-900 text-center mb-2">What Guides Us</h3>
          <p className="reveal text-stone-500 text-center text-sm mb-10">Our Values</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => { const Icon = VALUE_ICONS[v.icon] || Award; return (
              <div key={v.title} className="reveal p-8 bg-white border border-stone-100 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5"><Icon className="w-8 h-8 text-gold" /></div>
                <h4 className="font-display text-xl text-stone-900">{v.title}</h4>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">{v.description}</p>
              </div>
            ); })}
          </div>
        </div>

        {/* Team */}
        {team.length > 0 && (
          <div className="mt-20">
            <h3 className="reveal font-display text-2xl text-stone-900 text-center mb-2">Leadership</h3>
            <p className="reveal text-stone-500 text-center text-sm mb-10">Meet Our Team</p>
            <div className="flex flex-wrap justify-center gap-8">
              {team.map((m) => (
                <div key={m.id} className="reveal w-72 p-8 bg-white border border-stone-100 text-center hover:shadow-md transition-all duration-300">
                  <div className="w-36 h-36 mx-auto overflow-hidden rounded-full border-4 border-gold/20">{m.image && <img src={m.image} alt={m.name} className="w-full h-full object-cover" />}</div>
                  <h4 className="mt-6 font-display text-xl font-medium text-stone-900">{m.name}</h4>
                  <p className="mt-1 text-gold text-sm tracking-wider uppercase">{m.role}</p>
                  {m.bio && <p className="mt-3 text-sm text-stone-600 leading-relaxed">{m.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
