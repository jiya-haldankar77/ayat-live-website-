import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Check, ChevronLeft, ChevronRight, X, FileText, Play, ArrowLeft, Calendar, Phone } from 'lucide-react';
import { fetchPropertyBySlug } from '@/lib/services';
import { createBooking, createInquiry } from '@/lib/services';
import type { PropertyWithRelations } from '@/types';
import { STATUS_LABELS, STATUS_STYLES } from '@/lib/siteData';
import { useSettings } from '@/contexts/SettingsContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function PropertyDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const settings = useSettings();
  useScrollReveal();
  const [property, setProperty] = useState<PropertyWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<'gallery' | 'floorplans' | 'amenities' | 'location'>('gallery');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPropertyBySlug(slug).then((p) => { setProperty(p); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  const images = property?.images?.length ? property.images : [];

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!property) return;
    const fd = new FormData(e.currentTarget);
    await createBooking({
      property_id: property.id,
      customer_name: String(fd.get('name')),
      customer_email: String(fd.get('email')),
      customer_phone: String(fd.get('phone')),
      booking_date: String(fd.get('date')),
      notes: String(fd.get('notes') || ''),
    });
    setBookingOpen(false);
    navigate('/thank-you');
  };

  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createInquiry({
      name: String(fd.get('name')),
      phone: String(fd.get('phone')),
      email: String(fd.get('email')),
      message: String(fd.get('message')),
      interested_property: property?.title || null,
      budget: String(fd.get('budget') || ''),
      source_page: 'property-details',
    });
    setInquiryOpen(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="bg-white pt-20 min-h-[60vh]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 animate-pulse">
          <div className="h-96 bg-stone-100 mb-8" />
          <div className="h-8 bg-stone-100 w-1/3 mb-4" />
          <div className="h-4 bg-stone-100 w-2/3" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white pt-20 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-stone-900 mb-3">Property Not Found</h1>
          <p className="text-stone-500 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="px-6 py-3 bg-gold text-stone-900 text-sm font-semibold tracking-wider uppercase hover:bg-gold-500">Back to Properties</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'gallery' as const, label: 'Gallery' },
    { id: 'floorplans' as const, label: 'Floor Plans' },
    { id: 'amenities' as const, label: 'Amenities' },
    { id: 'location' as const, label: 'Location' },
  ];

  return (
    <div className="bg-white pt-16">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 text-sm text-stone-500">
        <Link to="/" className="hover:text-gold">Home</Link> / <Link to="/properties" className="hover:text-gold">Properties</Link> / <span className="text-stone-900">{property.title}</span>
      </div>

      {/* Gallery */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="relative h-80 md:h-[520px] overflow-hidden bg-stone-100">
          <img src={images[activeImg] || images[0]} alt={property.title} className="w-full h-full object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setActiveImg((i) => (i + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"><ChevronRight className="w-5 h-5" /></button>
            </>
          )}
          <span className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-medium border ${STATUS_STYLES[property.status] || STATUS_STYLES.available}`}>{STATUS_LABELS[property.status] || 'Available'}</span>
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-24 h-20 overflow-hidden flex-shrink-0 border-2 ${activeImg === i ? 'border-gold' : 'border-transparent opacity-60'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="flex items-center gap-2 text-stone-500 text-sm mb-2"><MapPin className="w-4 h-4 text-gold" />{property.location}</p>
          <h1 className="font-display text-4xl font-medium text-stone-900">{property.title}</h1>
          <p className="mt-3 text-stone-600 leading-relaxed">{property.short_description || property.description}</p>

          {/* Specs */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { icon: Bed, label: 'Bedrooms', value: property.bedrooms || '—' },
              { icon: Bath, label: 'Bathrooms', value: property.bathrooms || '—' },
              { icon: Maximize, label: 'Area', value: property.area_sqft || '—' },
            ].map((s) => { const Icon = s.icon; return (
              <div key={s.label} className="p-4 bg-cream border border-stone-100 text-center">
                <Icon className="w-5 h-5 text-gold mx-auto mb-2" />
                <div className="text-stone-900 font-medium text-sm">{s.value}</div>
                <div className="text-xs text-stone-500 mt-0.5">{s.label}</div>
              </div>
            ); })}
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex gap-1 border-b border-stone-200">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-3 text-sm font-medium transition-colors ${tab === t.id ? 'text-gold border-b-2 border-gold' : 'text-stone-500 hover:text-stone-900'}`}>{t.label}</button>
              ))}
            </div>

            <div className="pt-6">
              {tab === 'gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, i) => <div key={i} className="aspect-square overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>)}
                </div>
              )}
              {tab === 'floorplans' && (
                <div>
                  {property.floorplans?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.floorplans.map((fp) => <div key={fp.id} className="border border-stone-100"><img src={fp.image_url} alt={fp.label || 'Floor plan'} className="w-full" /><p className="p-3 text-sm text-stone-600 text-center">{fp.label}</p></div>)}
                    </div>
                  ) : <p className="text-stone-500">Floor plans are not available for this property yet.</p>}
                </div>
              )}
              {tab === 'amenities' && (
                <div>
                  {property.amenities?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((a) => <div key={a.id} className="flex items-center gap-2.5 text-sm text-stone-700"><Check className="w-4 h-4 text-gold" />{a.name}</div>)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((f) => <div key={f} className="flex items-center gap-2.5 text-sm text-stone-700"><Check className="w-4 h-4 text-gold" />{f}</div>)}
                    </div>
                  )}
                </div>
              )}
              {tab === 'location' && (
                <div>
                  {property.map_embed_url ? (
                    <iframe src={property.map_embed_url} className="w-full h-80 border-0" title="Location map" />
                  ) : (
                    <div className="bg-cream border border-stone-100 p-8 text-center">
                      <MapPin className="w-10 h-10 text-gold mx-auto mb-3" />
                      <p className="text-stone-700 font-medium">{property.location}</p>
                      <p className="text-stone-500 text-sm mt-1">Detailed map view available on request.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-10">
            <h2 className="font-display text-2xl text-stone-900 mb-4">About This Property</h2>
            <p className="text-stone-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          {property.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl text-stone-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((f) => <div key={f} className="flex items-center gap-2.5 text-sm text-stone-700"><Check className="w-4 h-4 text-gold" />{f}</div>)}
              </div>
            </div>
          )}

          {/* Video */}
          {property.video_url && (
            <div className="mt-8">
              <h2 className="font-display text-2xl text-stone-900 mb-4">Property Video</h2>
              <a href={property.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-900 border border-stone-300 hover:bg-stone-900 hover:text-white transition-colors">
                <Play className="w-4 h-4" /> Watch Video
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-cream border border-stone-100 p-6">
              <div className="font-display text-3xl font-semibold text-gold">{property.price}</div>
              {property.price_range && <p className="text-xs text-stone-500 mt-1">{property.price_range}</p>}
              <span className="mt-3 inline-block text-xs text-stone-500 uppercase tracking-wide">{property.mandate_type === 'exclusive' ? 'Exclusive Mandate' : 'Open Listing'}</span>

              <div className="mt-6 space-y-3">
                <button onClick={() => setBookingOpen(true)} className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" /> Book a Visit
                </button>
                <button onClick={() => setInquiryOpen(true)} className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 border border-stone-300 hover:bg-stone-900 hover:text-white transition-colors">
                  Send Inquiry
                </button>
                <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`I'm interested in ${property.title}`)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors">
                  <Phone className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              {property.brochure_url && (
                <a href={property.brochure_url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-sm text-gold hover:underline">
                  <FileText className="w-4 h-4" /> Download Brochure
                </a>
              )}
              {property.completion_date && (
                <p className="mt-4 text-xs text-stone-500">Completion: {new Date(property.completion_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
              )}
            </div>

            <Link to="/properties" className="flex items-center gap-2 text-sm text-stone-600 hover:text-gold">
              <ArrowLeft className="w-4 h-4" /> Back to Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {bookingOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setBookingOpen(false)}>
          <form onSubmit={handleBooking} className="bg-white p-7 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-display text-2xl text-stone-900">Book a Visit</h2><button type="button" onClick={() => setBookingOpen(false)}><X className="w-5 h-5 text-stone-500" /></button></div>
            <p className="text-sm text-stone-500 mb-5">{property.title} — {property.location}</p>
            <div className="space-y-3">
              <input name="name" required placeholder="Your Name" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <input name="email" type="email" required placeholder="Email" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <input name="phone" required placeholder="Phone" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <input name="date" type="date" required className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <textarea name="notes" rows={3} placeholder="Notes (optional)" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none resize-none" />
            </div>
            <button type="submit" className="mt-5 w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500">Confirm Booking</button>
          </form>
        </div>
      )}

      {/* Inquiry modal */}
      {inquiryOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setInquiryOpen(false)}>
          <form onSubmit={handleInquiry} className="bg-white p-7 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-display text-2xl text-stone-900">Send Inquiry</h2><button type="button" onClick={() => setInquiryOpen(false)}><X className="w-5 h-5 text-stone-500" /></button></div>
            <div className="space-y-3">
              <input name="name" required placeholder="Your Name" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <input name="email" type="email" required placeholder="Email" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <input name="phone" required placeholder="Phone" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <input name="budget" placeholder="Budget (optional)" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none" />
              <textarea name="message" required rows={4} placeholder="Your Message" className="w-full px-4 py-3 text-sm border border-stone-200 focus:border-gold outline-none resize-none" />
            </div>
            <button type="submit" className="mt-5 w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500">Send Inquiry</button>
          </form>
        </div>
      )}

      {/* Submitted toast */}
      {submitted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-emerald-600 text-white px-6 py-4 text-sm flex items-center gap-2">
          <Check className="w-5 h-5" /> Inquiry sent! We'll be in touch within 24 hours.
        </div>
      )}
    </div>
  );
}
