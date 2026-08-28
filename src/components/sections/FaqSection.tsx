import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqsApi } from '@/lib/api';
import { useEffect } from 'react';
import type { Faq } from '@/types';

export default function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    faqsApi.getPublished().then((data: any) => setFaqs(data)).catch(() => {});
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-10">
          <p className="text-gold text-xs font-semibold tracking-widest2 uppercase mb-3">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-stone-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="reveal bg-white border border-stone-100">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                <span className="font-display text-lg text-stone-900">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gold flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <div className="px-5 pb-5 text-stone-600 text-sm leading-relaxed">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
