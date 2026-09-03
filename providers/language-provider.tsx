'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import { Language, DEFAULT_LANGUAGE, translations } from '@/lib/i18n/translations';

const LANGUAGE_STORAGE_KEY = 'language';
const LANGUAGE_CHANGE_EVENT = 'grapery:language-change';

function isLanguage(value: string | null): value is Language {
  return !!value && value in translations;
}

/** Client-only snapshot: saved preference, else browser language, else default. */
function readClientLanguage(): Language {
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isLanguage(saved)) return saved;
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) return 'zh-Hans';
  if (browserLang.startsWith('ja')) return 'ja';
  return DEFAULT_LANGUAGE;
}

/** Subscribe to same-tab changes and cross-tab storage sync. */
function subscribeLanguage(callback: () => void): () => void {
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // t function: key, optional default value, optional params
  t: (key: string, defaultValueOrParams?: string | Record<string, string | number>, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Server render uses the default; after hydration the stored/browser
  // preference takes over without a hydration mismatch.
  const language = useSyncExternalStore(
    subscribeLanguage,
    readClientLanguage,
    () => DEFAULT_LANGUAGE
  );

  const setLanguage = useCallback((newLanguage: Language) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }, []);

  // Keep the document language attribute in sync (external system).
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = useCallback((key: string, defaultValueOrParams?: string | Record<string, string | number>, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];

    for (const k of keys) {
      value = (value as Record<string, unknown> | undefined)?.[k];
    }

    let result = (typeof value === 'string' ? value : undefined);

    // If result is undefined, try to use defaultValue if provided as string
    if (result === undefined && typeof defaultValueOrParams === 'string') {
      result = defaultValueOrParams;
    }

    // If we still have no result, fallback to key
    if (result === undefined) {
      return key;
    }

    // Determine actual params
    const actualParams = typeof defaultValueOrParams === 'object' ? defaultValueOrParams : params;

    if (actualParams) {
      return result.replace(/{(\w+)}/g, (match, paramKey) => {
        return actualParams[paramKey]?.toString() || match;
      });
    }

    return result;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

// Re-export commonly used types and constants
export type { Language } from '@/lib/i18n/translations';
export { LANGUAGE_NAMES } from '@/lib/i18n/translations';
