'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, DEFAULT_LANGUAGE, LANGUAGE_NAMES, translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or browser preference
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
      
      // Try to detect browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        return 'zh-Hans';
      } else if (browserLang.startsWith('ja')) {
        return 'ja';
      }
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      document.documentElement.lang = newLanguage;
    }
  };

  // Set document language on mount and language change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value === 'string' && params) {
      return value.replace(/{(\w+)}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return typeof value === 'string' ? value : key;
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
