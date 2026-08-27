import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Check, MessageCircle } from 'lucide-react';
import { createInquiry } from '@/lib/services';
import { useSettings } from '@/contexts/SettingsContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const INQUIRY_TYPES = ['General Inquiry', 'Property Inquiry', 'Launch Packages', 'Media Production', 'Developer Partnership', 'SecureBuy Due Diligence'];

export default function ContactPage() {
  useScrollReveal();
  const settings = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: INQUIRY_TYPES[0], message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        interested_property: form.inquiryType,
        budget: null,
        source_page: 'contact',
      });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', inquiryType: INQUIRY_TYPES[0], message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 5000);
    }
  };

  const cards = [
    { icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone?.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: 'Office Address', value: settings.address, href: '#' },
    { icon: Clock, label: 'Working Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM', href: '#' },
  ];

  return (
    <div className="bg-white pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">GET IN TOUCH</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Let's Build Something Exceptional</h1>
          <p className="mt-5 text-stone-600 max-w-2xl mx-auto">Let's discuss how AAYAT can help you achieve exceptional results in Goa's luxury real estate market.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cards.map((c, i) => { const Icon = c.icon; return (
              <a key={c.label} href={c.href} className="reveal flex items-start gap-4 p-6 bg-cream border border-stone-100 hover:shadow-md transition-all group" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors"><Icon className="w-6 h-6 text-gold" /></div>
                <div><p className="text-xs text-stone-500 uppercase tracking-wider">{c.label}</p><p className="mt-1 text-stone-900 font-medium text-sm">{c.value}</p></div>
              </a>
            ); })}
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="reveal flex items-center gap-3 p-6 bg-emerald-50 border border-emerald-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"><MessageCircle className="w-6 h-6 text-emerald-600" /></div>
              <div><p className="text-xs text-emerald-700/70 uppercase tracking-wider">WhatsApp</p><p className="mt-1 text-stone-900 font-medium text-sm">Chat on WhatsApp</p></div>
            </a>
          </div>

          <div className="lg:col-span-3 reveal">
            <form onSubmit={handleSubmit} className="p-7 md:p-8 bg-cream border border-stone-100">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs text-stone-500 mb-1.5">Your Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 text-sm bg-white border border-stone-200 focus:border-gold outline-none" placeholder="John Doe" /></div>
                <div><label className="block text-xs text-stone-500 mb-1.5">Email *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 text-sm bg-white border border-stone-200 focus:border-gold outline-none" placeholder="john@example.com" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div><label className="block text-xs text-stone-500 mb-1.5">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 text-sm bg-white border border-stone-200 focus:border-gold outline-none" placeholder="+91 98765 43210" /></div>
                <div><label className="block text-xs text-stone-500 mb-1.5">Inquiry Type</label><select value={form.inquiryType} onChange={(e) => setForm({ ...form, inquiryType: e.target.value })} className="w-full px-4 py-3 text-sm bg-white border border-stone-200 focus:border-gold outline-none cursor-pointer">{INQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="mt-4"><label className="block text-xs text-stone-500 mb-1.5">Message *</label><textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 text-sm bg-white border border-stone-200 focus:border-gold outline-none resize-none" placeholder="Tell us about your requirements..." /></div>
              <button type="submit" disabled={submitted} className={`mt-6 w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${submitted ? 'bg-emerald-600 text-white' : 'bg-gold text-stone-900 hover:bg-gold-500'}`}>
                {submitted ? <><Check className="w-4 h-4" /> Message Sent</> : <><Send className="w-4 h-4" /> Send Inquiry</>}
              </button>
              {error && <p className="mt-3 text-sm text-red-600 text-center">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
