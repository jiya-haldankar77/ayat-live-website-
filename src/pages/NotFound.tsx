import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-display text-9xl font-bold text-gold">404</h1>
        <p className="font-display text-2xl text-stone-900 mt-4">Page Not Found</p>
        <p className="text-stone-500 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 transition-colors">
          <Home className="w-4 h-4" /> Go Home
        </Link>
      </div>
    </div>
  );
}
