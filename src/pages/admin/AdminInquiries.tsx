import { useEffect, useState } from 'react';
import { Search, Trash2, Mail, Archive, CheckCircle, Download } from 'lucide-react';
import { fetchAllInquiries, updateInquiry, deleteInquiry } from '@/lib/services';
import type { ContactInquiry } from '@/types';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    fetchAllInquiries().then((d) => { setInquiries(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (inq: ContactInquiry, status: string) => {
    try {
      await updateInquiry(inq.id, { status });
      load();
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };
  const remove = async (inq: ContactInquiry) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await deleteInquiry(inq.id);
      load();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };
  const exportCsv = () => {
    const headers = ['Name', 'Phone', 'Email', 'Message', 'Property', 'Budget', 'Source', 'Date'];
    const rows = inquiries.map((i) => [i.name, i.phone, i.email, i.message, i.interested_property || '', i.budget || '', i.source_page || '', new Date(i.created_at).toLocaleString()]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'inquiries.csv'; a.click();
  };

  const filtered = inquiries.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s: string) => {
    if (s === 'read') return 'bg-sky-100 text-sky-700';
    if (s === 'archived') return 'bg-stone-100 text-stone-500';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inquiries..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:border-gold outline-none" />
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 text-sm border border-stone-200 rounded-lg hover:bg-stone-50"><Download className="w-4 h-4" /> Export CSV</button>
      </div>

      <div className="space-y-3">
        {filtered.map((inq) => (
          <div key={inq.id} className="bg-white border border-stone-100 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium text-stone-900">{inq.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusColor(inq.status)}`}>{inq.status}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                  <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-gold">{inq.email}</a>
                  <span>{inq.phone}</span>
                  <span>{new Date(inq.created_at).toLocaleString('en-IN')}</span>
                  {inq.interested_property && <span className="text-gold">{inq.interested_property}</span>}
                  {inq.source_page && <span className="text-stone-400">via {inq.source_page}</span>}
                </div>
                <p className="mt-2 text-sm text-stone-600">{inq.message}</p>
                {inq.budget && <p className="mt-1 text-xs text-stone-500">Budget: {inq.budget}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => updateStatus(inq, 'read')} className="p-2 text-sky-600 hover:bg-sky-50 rounded" title="Mark Read"><CheckCircle className="w-4 h-4" /></button>
                <a href={`mailto:${inq.email}`} className="p-2 text-stone-500 hover:bg-stone-50 rounded" title="Reply"><Mail className="w-4 h-4" /></a>
                <button onClick={() => updateStatus(inq, 'archived')} className="p-2 text-stone-500 hover:bg-stone-50 rounded" title="Archive"><Archive className="w-4 h-4" /></button>
                <button onClick={() => remove(inq)} className="p-2 text-stone-400 hover:text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-stone-400">{loading ? 'Loading...' : 'No inquiries found.'}</div>}
      </div>
    </div>
  );
}
