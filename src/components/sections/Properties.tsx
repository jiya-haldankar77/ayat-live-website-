import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { fetchFeaturedProperties } from '@/lib/services';
import type { Property } from '@/types';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProperties(3).then((data) => { setProperties(data); setLoading(false); }).catch((err) => {
      console.error('Failed to fetch properties:', err);
      setLoading(false);
    });
  }, []);

  const display = properties.slice(0, 3);

  return (
    <section className="bg-white pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal flex items-end justify-between mb-10">
          <div>
            <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">FEATURED COLLECTION</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Exceptional Properties</h2>
          </div>
          <button onClick={() => navigate('/properties')} className="hidden md:flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 group transition-colors">
            View All Properties <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="animate-pulse"><div className="bg-stone-100 h-72 md:h-80 w-full" /><div className="pt-4 space-y-2"><div className="h-3 bg-stone-100 w-24 rounded" /><div className="h-5 bg-stone-100 w-40 rounded" /><div className="h-4 bg-stone-100 w-16 rounded" /></div></div>)}
          </div>
        ) : display.length === 0 ? (
          <p className="text-stone-500 text-center py-12">No properties available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
            {display.map((property, i) => (
              <button key={property.id} onClick={() => navigate(`/property/${property.slug || property.id}`)} className="reveal text-left group" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="relative overflow-hidden">
                  <div className="h-72 md:h-80 overflow-hidden">
                    <img src={property.images?.[0] || 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  {property.mandate_type === 'exclusive' && <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-stone-900 text-xs font-bold tracking-wider uppercase">EXCLUSIVE</span>}
                </div>
                <div className="pt-4">
                  <p className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5"><MapPin className="w-3.5 h-3.5 flex-shrink-0" />{property.location.split(',')[0]}</p>
                  <h3 className={`font-display text-xl font-medium group-hover:text-gold transition-colors ${property.featured ? 'text-gold' : 'text-stone-900'}`}>{property.title}</h3>
                  <p className="mt-1 text-stone-900 font-display text-lg font-medium">{property.price}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 md:hidden">
          <button onClick={() => navigate('/properties')} className="flex items-center gap-2 text-sm font-medium text-stone-700">View All Properties <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    </section>
  );
}
