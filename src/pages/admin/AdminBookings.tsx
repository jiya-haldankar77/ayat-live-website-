import { useEffect, useState } from 'react';
import { Search, Check, X, Trash2 } from 'lucide-react';
import { bookingsApi } from '@/lib/api';
import type { Booking } from '@/types';

const STATUSES = ['pending', 'confirmed', 'rejected', 'cancelled'];
const PAYMENT = ['unpaid', 'partial', 'paid'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = () => {
    useEffect(() => {
      bookingsApi.getAll().then((data: any) => setBookings(data)).catch(() => {});
    }, []);
    setLoading(true);
    bookingsApi.getAll().then((data: any) => { setBookings(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await bookingsApi.update(id, { status });
    bookingsApi.getAll().then((data: any) => setBookings(data)).catch(() => {});
  };

  const updatePayment = async (id: string, payment_status: string) => {
    try {
      await bookingsApi.update(id, { payment_status });
      bookingsApi.getAll().then((data: any) => setBookings(data)).catch(() => {});
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this booking?')) {
      await bookingsApi.delete(id);
      bookingsApi.getAll().then((data: any) => setBookings(data)).catch(() => {});
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch = b.customer_name.toLowerCase().includes(search.toLowerCase()) || b.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'bg-emerald-100 text-emerald-700';
    if (s === 'rejected') return 'bg-red-100 text-red-700';
    if (s === 'cancelled') return 'bg-stone-100 text-stone-600';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:border-gold outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:border-gold outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wider">
            <tr><th className="text-left p-4">Customer</th><th className="text-left p-4">Date</th><th className="text-left p-4">Status</th><th className="text-left p-4">Payment</th><th className="text-right p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50">
                <td className="p-4"><p className="font-medium text-stone-900">{b.customer_name}</p><p className="text-xs text-stone-500">{b.customer_email}</p><p className="text-xs text-stone-500">{b.customer_phone}</p>{b.notes && <p className="text-xs text-stone-400 mt-1 italic">"{b.notes}"</p>}</td>
                <td className="p-4 text-stone-600">{new Date(b.booking_date).toLocaleDateString('en-IN')}</td>
                <td className="p-4"><select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${statusColor(b.status)}`}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
                <td className="p-4"><select value={b.payment_status} onChange={(e) => updatePayment(b.id, e.target.value)} className="text-xs px-2 py-1 rounded bg-stone-100 border-0 cursor-pointer">{PAYMENT.map((p) => <option key={p} value={p}>{p}</option>)}</select></td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => updateStatus(b.id, 'confirmed')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded" title="Confirm"><Check className="w-4 h-4" /></button>
                    <button onClick={() => updateStatus(b.id, 'rejected')} className="p-2 text-red-500 hover:bg-red-50 rounded" title="Reject"><X className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 text-stone-400 hover:text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-stone-400">{loading ? 'Loading...' : 'No bookings found.'}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
