import en from './translations/en.json';
import zhHans from './translations/zh-Hans.json';
import ja from './translations/ja.json';

export type Language = 'en' | 'zh-Hans' | 'ja';

export const translations: Record<Language, unknown> = {
  en,
  'zh-Hans': zhHans,
  ja,
};

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_NAMES: Record<Language, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  'zh-Hans': { name: 'Simplified Chinese', nativeName: '简体中文' },
  ja: { name: 'Japanese', nativeName: '日本語' },
};

export function getTranslation(key: string, language: Language = DEFAULT_LANGUAGE): string {
  const keys = key.split('.');
  let value: unknown = translations[language];

  for (const k of keys) {
    value = (value as Record<string, unknown> | undefined)?.[k];
  }

  return typeof value === 'string' && value ? value : key;
}

export function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}
