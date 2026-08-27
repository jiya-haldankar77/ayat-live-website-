import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Check, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/siteData';

const INQUIRY_TYPES = [
  'General Inquiry',
  'Property Inquiry',
  'Launch Packages',
  'Media Production',
  'Developer Partnership',
  'SecureBuy Due Diligence',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: INQUIRY_TYPES[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', phone: '', inquiryType: INQUIRY_TYPES[0], message: '' });
  };

  const cards = [
    { icon: Phone, label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: MapPin, label: 'Office Address', value: CONTACT.address, href: '#' },
    { icon: Clock, label: 'Working Hours', value: CONTACT.hours, href: '#' },
  ];

  return (
    <section id="contact" className="bg-white py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">GET IN TOUCH</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">
            Let's Build Something Exceptional
          </h2>
          <p className="mt-5 text-stone-600 max-w-2xl mx-auto">
            Let's discuss how AAYAT can help you achieve exceptional results in Goa's luxury real
            estate market.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.label}
                  href={card.href}
                  className="reveal flex items-start gap-4 p-6 bg-cream border border-stone-100 hover:shadow-md transition-all duration-300 group"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">{card.label}</p>
                    <p className="mt-1 text-stone-900 font-medium text-sm">{card.value}</p>
                  </div>
                </a>
              );
            })}

            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal flex items-center gap-3 p-6 bg-emerald-50 border border-emerald-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-700/70 uppercase tracking-wider">WhatsApp</p>
                <p className="mt-1 text-stone-900 font-medium text-sm">Chat on WhatsApp</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 reveal">
            <form
              onSubmit={handleSubmit}
              className="p-7 md:p-8 bg-cream border border-stone-100"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-gold outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-gold outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-gold outline-none transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Inquiry Type</label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-stone-200 text-stone-900 focus:border-gold outline-none cursor-pointer"
                  >
                    {INQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs text-stone-500 mb-1.5">Your Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-gold outline-none transition-colors resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`mt-6 w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  submitted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gold text-stone-900 hover:bg-gold-500'
                }`}
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    Message Sent — We'll be in touch within 24 hours.
                  </>
                ) : (
                  <>
                    Send Inquiry
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
