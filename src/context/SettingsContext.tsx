import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AppSettings {
  split: {
    defaultMode: 'slice' | 'visual' | 'all';
    defaultSlice: string;
    autoZip: boolean;
  };
  merge: {
    defaultPosition: 'end' | 'start' | 'inside';
    autoClear: boolean;
  };
  reduce: {
    defaultQuality: number;
    defaultBw: boolean;
    defaultSharpness: number;
    defaultTextWeight: number;
  };
  reorder: {
    confirmReverse: boolean;
    autoScroll: boolean;
  };
}

export const defaultAppSettings: AppSettings = {
  split: {
    defaultMode: 'slice',
    defaultSlice: '1:5',
    autoZip: true,
  },
  merge: {
    defaultPosition: 'end',
    autoClear: false,
  },
  reduce: {
    defaultQuality: 65,
    defaultBw: false,
    defaultSharpness: 0,
    defaultTextWeight: 0,
  },
  reorder: {
    confirmReverse: false,
    autoScroll: true,
  },
};

interface SettingsContextValue {
  settings: AppSettings;
  updateSplitSetting: <K extends keyof AppSettings['split']>(key: K, val: AppSettings['split'][K]) => void;
  updateMergeSetting: <K extends keyof AppSettings['merge']>(key: K, val: AppSettings['merge'][K]) => void;
  updateReduceSetting: <K extends keyof AppSettings['reduce']>(key: K, val: AppSettings['reduce'][K]) => void;
  updateReorderSetting: <K extends keyof AppSettings['reorder']>(key: K, val: AppSettings['reorder'][K]) => void;
  resetAllSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('pdfutils_settings');
      if (saved) return { ...defaultAppSettings, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return defaultAppSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('pdfutils_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const updateSplitSetting = <K extends keyof AppSettings['split']>(key: K, val: AppSettings['split'][K]) => {
    setSettings((prev) => ({ ...prev, split: { ...prev.split, [key]: val } }));
  };

  const updateMergeSetting = <K extends keyof AppSettings['merge']>(key: K, val: AppSettings['merge'][K]) => {
    setSettings((prev) => ({ ...prev, merge: { ...prev.merge, [key]: val } }));
  };

  const updateReduceSetting = <K extends keyof AppSettings['reduce']>(key: K, val: AppSettings['reduce'][K]) => {
    setSettings((prev) => ({ ...prev, reduce: { ...prev.reduce, [key]: val } }));
  };

  const updateReorderSetting = <K extends keyof AppSettings['reorder']>(key: K, val: AppSettings['reorder'][K]) => {
    setSettings((prev) => ({ ...prev, reorder: { ...prev.reorder, [key]: val } }));
  };

  const resetAllSettings = () => setSettings(defaultAppSettings);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSplitSetting,
        updateMergeSetting,
        updateReduceSetting,
        updateReorderSetting,
        resetAllSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
