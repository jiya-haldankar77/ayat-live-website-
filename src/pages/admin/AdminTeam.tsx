import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { teamApi } from '@/lib/api';
import type { TeamMember } from '@/types';

export default function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: '', role: '', bio: '', image: '', sort_order: 0, published: true });

  useEffect(() => {
    teamApi.getAll().then((data: any) => setItems(data)).catch(() => {});
  }, []);

  const openNew = () => { setForm({ name: '', role: '', bio: '', image: '', sort_order: items.length, published: true }); setEditing(null); setShowForm(true); };
  const openEdit = (m: TeamMember) => { setForm({ name: m.name, role: m.role, bio: m.bio || '', image: m.image || '', sort_order: m.sort_order, published: m.published }); setEditing(m); setShowForm(true); };
  const handleSave = async () => {
    if (editing) {
      await teamApi.update(editing.id, form);
    } else {
      await teamApi.create(form as Omit<TeamMember, 'id' | 'created_at'>);
    }
    setShowForm(false);
    teamApi.getAll().then((data: any) => setItems(data)).catch(() => {});
  };
  const handleDelete = async (id: string) => {
    if (confirm('Delete this team member?')) {
      await teamApi.delete(id);
      teamApi.getAll().then((data: any) => setItems(data)).catch(() => {});
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end"><button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-900 bg-gold hover:bg-gold-500 rounded-lg"><Plus className="w-4 h-4" /> Add Member</button></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => (
          <div key={m.id} className="bg-white border border-stone-100 rounded-xl p-5 text-center">
            {m.image && <img src={m.image} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gold/20" />}
            <p className="mt-3 font-medium text-stone-900">{m.name}</p>
            <p className="text-xs text-gold">{m.role}</p>
            {m.bio && <p className="text-xs text-stone-500 mt-2">{m.bio}</p>}
            <div className="mt-3 flex items-center justify-center gap-1"><button onClick={() => openEdit(m)} className="p-2 text-stone-500 hover:text-gold"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(m.id)} className="p-2 text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone-400 text-center py-8 col-span-3">No team members yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-lg rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-stone-100"><h2 className="font-display text-xl text-stone-900">{editing ? 'Edit' : 'Add'} Team Member</h2><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-stone-500" /></button></div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-stone-500 mb-1.5">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none" /></div>
                <div><label className="block text-xs text-stone-500 mb-1.5">Role *</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none" /></div>
              </div>
              <div><label className="block text-xs text-stone-500 mb-1.5">Bio</label><textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none resize-none" /></div>
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
