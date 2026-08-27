import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const { signIn, user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (location.state?.error === 'not_admin') {
      setError('You do not have admin privileges. Please contact the administrator.');
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      // Wait for admin check to complete
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex border-2 border-white px-3 py-1.5 mb-4">
            <span className="text-white font-bold tracking-wider" style={{ fontFamily: 'serif', fontSize: '16px' }}>ΔΔ¥ΔF</span>
          </div>
          <h1 className="font-display text-2xl text-white">Admin Panel</h1>
          <p className="text-stone-400 text-sm mt-1">Sign in to manage your platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-200 p-7 border border-white/5">
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm bg-dark-400 border border-white/10 text-white focus:border-gold outline-none" placeholder="admin@aayatprojects.in" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm bg-dark-400 border border-white/10 text-white focus:border-gold outline-none" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="mt-6 w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-stone-900 bg-gold hover:bg-gold-500 flex items-center justify-center gap-2 disabled:opacity-50">
            {submitting ? 'Signing in...' : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
