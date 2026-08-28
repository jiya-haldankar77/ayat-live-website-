import { useEffect, useState } from 'react';
import { Save, Check } from 'lucide-react';
import { settingsApi } from '@/lib/api';

const FIELDS = [
  { key: 'hero_title', label: 'Hero Title' },
  { key: 'hero_subtitle', label: 'Hero Subtitle' },
  { key: 'hero_description', label: 'Hero Description' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Office Address' },
  { key: 'whatsapp', label: 'WhatsApp Number' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'linkedin', label: 'LinkedIn URL' },
  { key: 'youtube', label: 'YouTube URL' },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsApi.getAll().then((data: any) => setValues(data)).catch(() => {});
  }, []);

  const handleSave = async (key: string) => {
    await settingsApi.update(key, values[key]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-white border border-stone-100 rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg text-stone-900">Homepage & Contact Settings</h2>
        <p className="text-sm text-stone-500">Edit your site content without touching code. Changes appear immediately on the live site.</p>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-stone-500 mb-1.5">{f.label}</label>
            {f.key === 'hero_description' ? (
              <textarea rows={3} value={values[f.key] || ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none resize-none" />
            ) : (
              <input value={values[f.key] || ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:border-gold outline-none" />
            )}
          </div>
        ))}
        <button onClick={() => handleSave('all')} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-gold text-stone-900 hover:bg-gold-500'}`}>
          {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
