import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Search, SlidersHorizontal, X } from 'lucide-react';
import { propertiesApi, categoriesApi } from '@/lib/api';
import type { Property, Category } from '@/types';
import { PROPERTY_TYPES, REGIONS, PRICE_FILTERS, SORT_OPTIONS, STATUS_LABELS, STATUS_STYLES } from '@/lib/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function PropertiesPage() {
  useScrollReveal();
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [region, setRegion] = useState('all');
  const [price, setPrice] = useState('all');
  const [beds, setBeds] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then((data: any) => setCategories(data)).catch(() => {});
    const t = setTimeout(() => {
      setLoading(true);
      propertiesApi.getPublished().then((data: any) => {
        let filtered = [...data];
        const range = PRICE_FILTERS.find((f) => f.value === price);
        
        if (type && type !== 'all') filtered = filtered.filter((p: Property) => p.property_type === type);
        if (region && region !== 'all') filtered = filtered.filter((p: Property) => p.region === region);
        if (beds && beds !== 'all') filtered = filtered.filter((p: Property) => (p.bedrooms || 0) >= Number(beds));
        if (range?.min) filtered = filtered.filter((p: Property) => p.price_value >= range.min);
        if (range?.max) filtered = filtered.filter((p: Property) => p.price_value < range.max);
        if (search) filtered = filtered.filter((p: Property) => 
          p.title?.toLowerCase().includes(search.toLowerCase()) || 
          p.location?.toLowerCase().includes(search.toLowerCase())
        );
        
        let sorted = [...filtered];
        if (sort === 'price_asc') sorted.sort((a: Property, b: Property) => a.price_value - b.price_value);
        else if (sort === 'price_desc') sorted.sort((a: Property, b: Property) => b.price_value - a.price_value);
        else sorted.sort((a: Property, b: Property) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        
        setProperties(sorted);
        setLoading(false);
      }).catch(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search, type, region, price, beds, sort]);

  const hasFilters = type !== 'all' || region !== 'all' || price !== 'all' || beds !== 'all';
  const clearFilters = () => { setType('all'); setRegion('all'); setPrice('all'); setBeds('all'); setSearch(''); };

  return (
    <div className="bg-white pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal mb-10">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">OUR COLLECTION</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-stone-900">All Properties</h1>
          <p className="mt-4 text-stone-600 max-w-2xl">Discover Goa's most distinguished addresses. Each property in our collection represents the finest in luxury living.</p>
        </div>

        {/* Search + filters */}
        <div className="reveal flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or location..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream border border-stone-200 focus:border-gold outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-5 py-2.5 text-sm bg-cream border border-stone-200 hover:border-gold transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filters {hasFilters && <span className="w-5 h-5 rounded-full bg-gold text-stone-900 text-xs flex items-center justify-center font-bold">{[type, region, price, beds].filter((f) => f !== 'all').length}</span>}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2.5 text-sm bg-cream border border-stone-200 focus:border-gold outline-none cursor-pointer">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 bg-cream border border-stone-100">
              {[
                { label: 'Property Type', value: type, set: setType, options: PROPERTY_TYPES },
                { label: 'Location', value: region, set: setRegion, options: REGIONS },
                { label: 'Price Range', value: price, set: setPrice, options: PRICE_FILTERS.map((f) => ({ label: f.label, value: f.value })) },
                { label: 'Bedrooms', value: beds, set: setBeds, options: [{ label: 'Any Beds', value: 'all' }, { label: '2+ Beds', value: '2' }, { label: '3+ Beds', value: '3' }, { label: '4+ Beds', value: '4' }, { label: '5+ Beds', value: '5' }] },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs text-stone-500 mb-1.5">{f.label}</label>
                  <select value={f.value} onChange={(e) => f.set(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-white border border-stone-200 focus:border-gold outline-none cursor-pointer">
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
              {hasFilters && <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-gold col-span-2 md:col-span-4 justify-self-start"><X className="w-4 h-4" /> Clear Filters</button>}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse"><div className="bg-stone-100 h-72 w-full" /><div className="pt-4 space-y-2"><div className="h-4 bg-stone-100 w-24 rounded" /><div className="h-5 bg-stone-100 w-40 rounded" /><div className="h-4 bg-stone-100 w-16 rounded" /></div></div>)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20"><Search className="w-10 h-10 text-stone-300 mx-auto mb-4" /><p className="text-stone-500">No properties found matching your criteria.</p><button onClick={clearFilters} className="mt-4 px-6 py-2.5 text-sm text-gold border border-gold/30 hover:bg-gold/10">Clear Filters</button></div>
        ) : (
          <>
            <p className="text-sm text-stone-500 mb-6">Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p, i) => (
                <Link key={p.id} to={`/property/${p.slug || p.id}`} className="reveal group bg-white border border-stone-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className="relative h-64 overflow-hidden">
                    <img src={p.images?.[0] || 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium border ${STATUS_STYLES[p.status] || STATUS_STYLES.available}`}>{STATUS_LABELS[p.status] || 'Available'}</span>
                    {p.featured && <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold bg-gold text-stone-900">FEATURED</span>}
                  </div>
                  <div className="p-5">
                    <p className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5"><MapPin className="w-3.5 h-3.5" />{p.location.split(',')[0]}</p>
                    <h3 className="font-display text-xl font-medium text-stone-900 group-hover:text-gold transition-colors">{p.title}</h3>
                    <p className="mt-1 text-sm text-stone-500 line-clamp-2">{p.short_description || p.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-stone-500">
                      {p.bedrooms != null && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{p.bedrooms}</span>}
                      {p.bathrooms != null && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{p.bathrooms}</span>}
                      {p.area_sqft && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{p.area_sqft}</span>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="font-display text-xl font-semibold text-gold">{p.price}</span>
                      <span className="text-sm text-gold group-hover:translate-x-1 transition-transform">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
