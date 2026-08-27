import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star, Search } from 'lucide-react';
import { fetchAllProperties, createProperty, updateProperty, deleteProperty, fetchCategories, uploadImage, deleteImage } from '@/lib/services';
import type { Property, Category } from '@/types';
import { PROPERTY_TYPES, REGIONS, STATUS_LABELS } from '@/lib/siteData';

const EMPTY = {
  title: '', slug: '', location: '', price: '', price_value: 0, price_range: '', property_type: 'villa', category_id: '', bedrooms: '', bathrooms: '', area_sqft: '', region: 'north', description: '', short_description: '', features: [] as string[], images: [] as string[], video_url: '', brochure_url: '', status: 'available', mandate_type: 'exclusive', featured: false, published: true, completion_date: '', latitude: '', longitude: '', map_embed_url: '',
};

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [imageUrl, setImageUrl] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllProperties().then((d) => { setProperties(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p: Property) => {
    setForm({
      ...EMPTY,
      title: p.title, slug: p.slug || '', location: p.location, price: p.price,
      price_value: p.price_value, price_range: p.price_range || '', property_type: p.property_type,
      category_id: p.category_id || '', area_sqft: p.area_sqft || '', region: p.region,
      description: p.description, short_description: p.short_description || '',
      features: p.features, images: p.images, video_url: p.video_url || '',
      brochure_url: p.brochure_url || '', status: p.status, mandate_type: p.mandate_type,
      featured: p.featured, published: p.published, map_embed_url: p.map_embed_url || '',
      bedrooms: String(p.bedrooms ?? ''), bathrooms: String(p.bathrooms ?? ''),
      completion_date: p.completion_date ? p.completion_date.split('T')[0] : '',
      latitude: String(p.latitude ?? ''), longitude: String(p.longitude ?? ''),
    });
    setEditing(p); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      title: form.title, slug: form.slug || null, location: form.location, price: form.price,
      price_value: Number(form.price_value), price_range: form.price_range || null,
      property_type: form.property_type, category_id: form.category_id || null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null, bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      area_sqft: form.area_sqft || null, region: form.region, description: form.description,
      short_description: form.short_description || null, features: form.features, images: form.images,
      video_url: form.video_url || null, brochure_url: form.brochure_url || null, status: form.status,
      mandate_type: form.mandate_type, featured: form.featured, published: form.published,
      completion_date: form.completion_date || null, latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null, map_embed_url: form.map_embed_url || null,
    };
    try {
      if (editing) {
        await updateProperty(editing.id, payload);
      } else {
        await createProperty(payload);
      }
      setSaving(false); setShowForm(false); load();
    } catch (error) {
      console.error('Error saving property:', error);
      setSaving(false);
    }
  };

  const remove = async (p: Property) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await deleteProperty(p.id);
      load();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const toggleFeatured = async (p: Property) => {
    try {
      await updateProperty(p.id, { featured: !p.featured });
      load();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const togglePublished = async (p: Property) => {
    try {
      await updateProperty(p.id, { published: !p.published });
      load();
    } catch (error) {
      console.error('Error toggling published:', error);
    }
  };

  const addImage = () => { if (imageUrl.trim()) { setForm({ ...form, images: [...form.images, imageUrl.trim()] }); setImageUrl(''); } };
  const addFeature = () => { if (featureInput.trim()) { setForm({ ...form, features: [...form.features, featureInput.trim()] }); setFeatureInput(''); } };

  const filtered = properties.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:border-gold outline-none" />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-900 bg-gold hover:bg-gold-500 rounded-lg"><Plus className="w-4 h-4" /> Add Property</button>
      </div>

      <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wider">
            <tr><th className="text-left p-4">Property</th><th className="text-left p-4">Price</th><th className="text-left p-4">Status</th><th className="text-center p-4">Featured</th><th className="text-center p-4">Published</th><th className="text-right p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="p-4"><div className="flex items-center gap-3"><img src={p.images?.[0] || ''} alt="" className="w-10 h-10 rounded object-cover" /><div><p className="font-medium text-stone-900">{p.title}</p><p className="text-xs text-stone-500">{p.location}</p></div></div></td>
                <td className="p-4 text-gold font-medium">{p.price}</td>
                <td className="p-4"><span className="text-xs px-2 py-1 bg-stone-100 rounded">{STATUS_LABELS[p.status] || p.status}</span></td>
                <td className="p-4 text-center"><button onClick={() => toggleFeatured(p)}><Star className={`w-5 h-5 ${p.featured ? 'text-gold fill-gold' : 'text-stone-300'}`} /></button></td>
                <td className="p-4 text-center"><button onClick={() => togglePublished(p)} className={`text-xs px-2 py-1 rounded ${p.published ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>{p.published ? 'Live' : 'Draft'}</button></td>
                <td className="p-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => openEdit(p)} className="p-2 text-stone-500 hover:text-gold"><Pencil className="w-4 h-4" /></button><button onClick={() => remove(p)} className="p-2 text-stone-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-stone-400">{loading ? 'Loading...' : 'No properties found.'}</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-2xl my-8 rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-stone-100"><h2 className="font-display text-xl text-stone-900">{editing ? 'Edit Property' : 'Add Property'}</h2><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-stone-500" /></button></div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title *"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="inp" /></Field>
                <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="inp" placeholder="villa-serenity" /></Field>
                <Field label="Location *"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="inp" /></Field>
                <Field label="Price *"><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="inp" placeholder="₹4.5 Cr" /></Field>
                <Field label="Price Value (rupees)"><input type="number" value={form.price_value} onChange={(e) => setForm({ ...form, price_value: Number(e.target.value) })} className="inp" /></Field>
                <Field label="Price Range"><input value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} className="inp" /></Field>
                <Field label="Property Type"><select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="inp">{PROPERTY_TYPES.filter((t) => t.value !== 'all').map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></Field>
                <Field label="Category"><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="inp"><option value="">None</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
                <Field label="Bedrooms"><input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="inp" /></Field>
                <Field label="Bathrooms"><input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="inp" /></Field>
                <Field label="Area"><input value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })} className="inp" placeholder="4,200 sq.ft." /></Field>
                <Field label="Region"><select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="inp">{REGIONS.filter((r) => r.value !== 'all').map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></Field>
                <Field label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="inp">{Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
                <Field label="Mandate Type"><select value={form.mandate_type} onChange={(e) => setForm({ ...form, mandate_type: e.target.value })} className="inp"><option value="exclusive">Exclusive</option><option value="open">Open</option></select></Field>
                <Field label="Completion Date"><input type="date" value={form.completion_date} onChange={(e) => setForm({ ...form, completion_date: e.target.value })} className="inp" /></Field>
                <Field label="Video URL"><input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="inp" /></Field>
                <Field label="Brochure URL"><input value={form.brochure_url} onChange={(e) => setForm({ ...form, brochure_url: e.target.value })} className="inp" /></Field>
                <Field label="Map Embed URL"><input value={form.map_embed_url} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} className="inp" /></Field>
              </div>
              <Field label="Short Description"><input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="inp" /></Field>
              <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="inp resize-none" /></Field>

              {/* Images */}
              <Field label="Images (URLs)">
                <div className="flex gap-2"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="inp flex-1" placeholder="https://..." /><button type="button" onClick={addImage} className="px-4 py-2.5 bg-gold text-stone-900 text-sm rounded">Add</button></div>
                <div className="flex flex-wrap gap-2 mt-2">{form.images.map((img, i) => <div key={i} className="relative w-16 h-16"><img src={img} alt="" className="w-full h-full object-cover rounded" /><button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"><X className="w-3 h-3" /></button></div>)}</div>
              </Field>

              {/* Features */}
              <Field label="Features">
                <div className="flex gap-2"><input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="inp flex-1" placeholder="Swimming Pool" /><button type="button" onClick={addFeature} className="px-4 py-2.5 bg-gold text-stone-900 text-sm rounded">Add</button></div>
                <div className="flex flex-wrap gap-2 mt-2">{form.features.map((f, i) => <span key={i} className="flex items-center gap-1 px-3 py-1 bg-stone-100 text-sm rounded">{f}<button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })}><X className="w-3 h-3" /></button></span>)}</div>
              </Field>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
              </div>
            </div>
            <div className="p-6 border-t border-stone-100 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm border border-stone-200 rounded-lg hover:bg-stone-50">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-stone-900 bg-gold hover:bg-gold-500 rounded-lg disabled:opacity-50">{saving ? 'Saving...' : 'Save Property'}</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.inp{width:100%;padding:0.625rem 0.875rem;font-size:0.875rem;background:#fff;border:1px solid #e7e5e4;border-radius:0.375rem;outline:none}.inp:focus{border-color:#C9A962}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs text-stone-500 mb-1.5">{label}</label>{children}</div>;
}
