import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center pt-20">
      <div className="text-center max-w-lg px-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="font-display text-4xl font-medium text-stone-900">Thank You!</h1>
        <p className="mt-4 text-stone-600 leading-relaxed">Your request has been received. Our team will be in touch with you within 24 hours to discuss the next steps.</p>
        <Link to="/" className="mt-8 inline-block px-8 py-4 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors">Back to Home</Link>
      </div>
    </div>
  );
}
