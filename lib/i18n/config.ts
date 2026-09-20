// lib/i18n/config.ts
// Central locale configuration. Everything i18n-related derives from this file.

export const locales = ['en', 'de', 'it', 'zh', 'ur', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Text direction per locale. Urdu and Arabic are RTL.
 * We keep this as data (not a hardcoded check) so adding another RTL
 * language later is a one-line change.
 */
export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  de: 'ltr',
  it: 'ltr',
  zh: 'ltr',
  ur: 'rtl',
  ar: 'rtl',
};

/** Native-language labels for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
  zh: '中文',
  ur: 'اردو',
  ar: 'العربية',
};

/** BCP 47 tags for <html lang> and hreflang. */
export const localeHrefLang: Record<Locale, string> = {
  en: 'en',
  de: 'de',
  it: 'it',
  zh: 'zh-Hans',
  ur: 'ur-PK',
  ar: 'ar',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return localeDirections[locale] ?? 'ltr';
}

export function isRTL(locale: Locale): boolean {
  return getDirection(locale) === 'rtl';
}
