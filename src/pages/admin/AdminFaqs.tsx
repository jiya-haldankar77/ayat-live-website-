import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { faqsApi } from '@/lib/api';
import type { Faq } from '@/types';

export default function AdminFaqs() {
  const [items, setItems] = useState<Faq[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', sort_order: 0, published: true });

  useEffect(() => {
    faqsApi.getAll().then((data: any) => setItems(data)).catch(() => {});
  }, []);

  const openNew = () => { setForm({ question: '', answer: '', sort_order: items.length, published: true }); setEditing(null); setShowForm(true); };
  const openEdit = (f: Faq) => { setForm({ question: f.question, answer: f.answer, sort_order: f.sort_order, published: f.published }); setEditing(f); setShowForm(true); };
  const handleSave = async () => {
    if (editing) {
      await faqsApi.update(editing.id, form);
    } else {
      await faqsApi.create(form as Omit<Faq, 'id' | 'created_at'>);
    }
    setShowForm(false);
    faqsApi.getAll().then((data: any) => setItems(data)).catch(() => {});
  };
  const handleDelete = async (id: string) => {
    if (confirm('Delete this FAQ?')) {
      await faqsApi.delete(id);
      faqsApi.getAll().then((data: any) => setItems(data)).catch(() => {});
    }
  };
  const move = async (f: Faq, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === f.id);
    const swap = items[idx + dir]; if (!swap) return;
    try {
      await Promise.all([faqsApi.update(f.id, { sort_order: swap.sort_order }), faqsApi.update(swap.id, { sort_order: f.sort_order })]);
      faqsApi.getAll().then((data: any) => setItems(data)).catch(() => {});
    } catch (error) {
      console.error('Error reordering FAQs:', error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end"><button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-900 bg-gold hover:bg-gold-500 rounded-lg"><Plus className="w-4 h-4" /> Add FAQ</button></div>
      <div className="space-y-3">
        {items.map((f, i) => (
          <div key={f.id} className="bg-white border border-stone-100 rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1"><p className="font-medium text-stone-900 text-sm">{f.question}</p><p className="text-sm text-stone-600 mt-1">{f.answer}</p>{!f.published && <span className="text-xs text-stone-400 mt-1 inline-block">Draft</span>}</div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => move(f, -1)} disabled={i === 0} className="p-1.5 text-stone-400 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
              <button onClick={() => move(f, 1)} disabled={i === items.length - 1} className="p-1.5 text-stone-400 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
              <button onClick={() => openEdit(f)} className="p-2 text-stone-500 hover:text-gold"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(f.id)} className="p-2 text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone-400 text-center py-8">No FAQs yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-lg rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-stone-100"><h2 className="font-display text-xl text-stone-900">{editing ? 'Edit' : 'Add'} FAQ</h2><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-stone-500" /></button></div>
            <div className="p-6 space-y-3">
              <div><label className="block text-xs text-stone-500 mb-1.5">Question *</label><input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none" /></div>
              <div><label className="block text-xs text-stone-500 mb-1.5">Answer *</label><textarea rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none resize-none" /></div>
              <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            </div>
            <div className="p-6 border-t border-stone-100 flex justify-end gap-3"><button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm border border-stone-200 rounded-lg">Cancel</button><button onClick={handleSave} className="px-5 py-2.5 text-sm font-medium text-stone-900 bg-gold rounded-lg">Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
