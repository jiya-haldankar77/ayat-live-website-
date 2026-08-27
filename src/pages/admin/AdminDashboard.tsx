import { useEffect, useState } from 'react';
import { Building2, CalendarDays, Mail, TrendingUp, Bell } from 'lucide-react';
import { fetchAdminDashboardStats, fetchProperties, fetchTestimonials } from '@/lib/services';
import type { Property, Testimonial, Notification } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProperties: 0, totalBookings: 0, totalInquiries: 0, notifications: [] as Notification[] });
  const [recentProps, setRecentProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminDashboardStats(), fetchProperties(), fetchTestimonials()])
      .then(([s, p]) => {
        setStats(s);
        setRecentProps(p.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarDays, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: Mail, color: 'bg-amber-50 text-amber-600' },
    { label: 'Testimonials', value: stats.notifications.length, icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => { const Icon = c.icon; return (
          <div key={c.label} className="bg-white border border-stone-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-stone-500">{c.label}</p><p className="font-display text-3xl font-semibold text-stone-900 mt-1">{loading ? '—' : c.value}</p></div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}><Icon className="w-6 h-6" /></div>
            </div>
          </div>
        ); })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent properties */}
        <div className="lg:col-span-2 bg-white border border-stone-100 rounded-xl p-6">
          <h2 className="font-display text-lg text-stone-900 mb-4">Recent Properties</h2>
          <div className="space-y-3">
            {recentProps.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg">
                <img src={p.images?.[0] || ''} alt={p.title} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0"><p className="font-medium text-stone-900 text-sm truncate">{p.title}</p><p className="text-xs text-stone-500">{p.location}</p></div>
                <span className="text-sm font-medium text-gold">{p.price}</span>
                {p.featured && <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded">Featured</span>}
              </div>
            ))}
            {recentProps.length === 0 && <p className="text-stone-400 text-sm text-center py-8">No properties yet.</p>}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-stone-100 rounded-xl p-6">
          <h2 className="font-display text-lg text-stone-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-gold" /> Recent Activity</h2>
          <div className="space-y-3">
            {stats.notifications.map((n) => (
              <div key={n.id} className="p-3 bg-stone-50 rounded-lg">
                <p className="text-sm font-medium text-stone-900">{n.title}</p>
                {n.body && <p className="text-xs text-stone-500 mt-0.5">{n.body}</p>}
                <p className="text-xs text-stone-400 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
              </div>
            ))}
            {stats.notifications.length === 0 && <p className="text-stone-400 text-sm text-center py-8">No activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
