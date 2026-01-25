'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, DEFAULT_LANGUAGE, LANGUAGE_NAMES, translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // t function: key, optional default value, optional params
  t: (key: string, defaultValueOrParams?: string | Record<string, string | number>, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language if no preference saved
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        setLanguageState('zh-Hans');
      } else if (browserLang.startsWith('ja')) {
        setLanguageState('ja');
      }
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
  };

  // Set document language on mount/change
  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = language;
    }
  }, [language, isMounted]);

  // Translation function
  const t = (key: string, defaultValueOrParams?: string | Record<string, string | number>, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
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
  };

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
