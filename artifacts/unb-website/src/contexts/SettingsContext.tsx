import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../lib/translations';
import { useLanguage } from './LanguageContext';

type SiteSettings = {
  homeContent?: any;
  profileContent?: any;
  newsContent?: any;
  galleryContent?: any;
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (key: string, value: any) => {
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (response.ok) {
        const updatedValue = await response.json();
        setSettings(prev => ({ ...prev, [key]: updatedValue }));
      }
    } catch (error) {
      console.error('Failed to update site settings:', error);
      throw error;
    }
  };

  const value = {
    settings,
    updateSettings,
    isLoading,
    refreshSettings: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
