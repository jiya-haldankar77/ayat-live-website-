import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/layouts/AdminLayout';

export default function ProtectedAdmin() {
  const { user, isAdmin, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-dark-400 flex items-center justify-center"><div className="text-stone-400 text-sm">Loading...</div></div>;
  }
  if (!user) {
    return <Navigate to="/admin" replace state={{ from: pathname }} />;
  }
  if (!isAdmin) {
    return <Navigate to="/admin" replace state={{ from: pathname, error: 'not_admin' }} />;
  }
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
