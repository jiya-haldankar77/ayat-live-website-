import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchSettings } from '@/lib/services';

type Settings = Record<string, string>;
const SettingsContext = createContext<Settings | undefined>(undefined);

const DEFAULTS: Settings = {
  hero_title: 'Where Vision Meets',
  hero_subtitle: 'Exceptional Living',
  hero_description: 'Aayat Projects is a full-service design and development studio delivering architecture, interior design, project management, construction supervision, and turnkey villa solutions across Goa.',
  phone: '+91 914545 0039',
  email: 'hello@aayatprojects.in',
  address: 'Porvorim, Sangolda, Goa 403521',
  whatsapp: '919145450039',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    // Try to fetch settings, but don't block rendering
    fetchSettings()
      .then((s) => setSettings({ ...DEFAULTS, ...s }))
      .catch((err) => console.error('Failed to fetch settings:', err));
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) return DEFAULTS;
  return ctx;
}
