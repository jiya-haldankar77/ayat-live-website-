import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { testimonialsApi } from '@/lib/api';
import type { Testimonial } from '@/types';

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ quote: '', author: '', role: '', image: '', published: true });

  useEffect(() => {
    testimonialsApi.getAll().then((data: any) => setItems(data)).catch(() => {});
  }, []);

  const openNew = () => { setForm({ quote: '', author: '', role: '', image: '', published: true }); setEditing(null); setShowForm(true); };
  const openEdit = (t: Testimonial) => { setForm({ quote: t.quote, author: t.author, role: t.role || '', image: t.image || '', published: t.published }); setEditing(t); setShowForm(true); };

  const handleSave = async () => {
    if (editing) {
      await testimonialsApi.update(editing.id, form);
    } else {
      await testimonialsApi.create(form as Omit<Testimonial, 'id' | 'created_at'>);
    }
    setShowForm(false);
    testimonialsApi.getAll().then((data: any) => setItems(data)).catch(() => {});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      await testimonialsApi.delete(id);
      testimonialsApi.getAll().then((data: any) => setItems(data)).catch(() => {});
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end"><button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-900 bg-gold hover:bg-gold-500 rounded-lg"><Plus className="w-4 h-4" /> Add Testimonial</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-white border border-stone-100 rounded-xl p-5">
            <p className="text-sm text-stone-600 italic">"{t.quote}"</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">{t.image && <img src={t.image} alt="" className="w-10 h-10 rounded-full object-cover" />}<div><p className="font-medium text-stone-900 text-sm">{t.author}</p>{t.role && <p className="text-xs text-stone-500">{t.role}</p>}</div></div>
              <div className="flex items-center gap-1"><button onClick={() => openEdit(t)} className="p-2 text-stone-500 hover:text-gold"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(t.id)} className="p-2 text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone-400 text-center py-8 col-span-2">No testimonials yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-lg rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-stone-100"><h2 className="font-display text-xl text-stone-900">{editing ? 'Edit' : 'Add'} Testimonial</h2><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-stone-500" /></button></div>
            <div className="p-6 space-y-3">
              <div><label className="block text-xs text-stone-500 mb-1.5">Quote *</label><textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-stone-500 mb-1.5">Author *</label><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none" /></div>
                <div><label className="block text-xs text-stone-500 mb-1.5">Role</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none" /></div>
              </div>
              <div><label className="block text-xs text-stone-500 mb-1.5">Image URL</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none" /></div>
              <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            </div>
            <div className="p-6 border-t border-stone-100 flex justify-end gap-3"><button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm border border-stone-200 rounded-lg">Cancel</button><button onClick={handleSave} className="px-5 py-2.5 text-sm font-medium text-stone-900 bg-gold rounded-lg">Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
