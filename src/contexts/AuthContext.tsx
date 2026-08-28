import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '@/lib/api';

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const token = localStorage.getItem('admin_token');
    if (token) {
      authApi.me()
        .then((data) => {
          setUser(data.admin);
          setIsAdmin(data.admin?.role === 'admin');
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[Auth] Starting sign in for:', email);
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('[Auth] API URL:', apiUrl);

      const data = await authApi.login(email, password);
      console.log('[Auth] Login successful:', data);

      setUser(data.admin);
      setIsAdmin(data.admin?.role === 'admin');

      return { error: null };
    } catch (error: any) {
      console.error('[Auth] Sign in error:', error);
      return { error: error.message || 'Authentication failed' };
    }
  };

  const signOut = async () => {
    authApi.logout();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
