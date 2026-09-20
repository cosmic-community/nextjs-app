// lib/i18n/dictionaries.ts
// Server-only dictionary loader.
//
// Why static imports instead of dynamic import(): Next.js can statically
// analyse these and include them in the server bundle. Dictionaries are small
// JSON blobs, they are only ever read in Server Components, so none of this
// ships to the browser.

import type { Locale } from './config';
import { defaultLocale } from './config';

import en from './dictionaries/en.json';
import de from './dictionaries/de.json';
import it from './dictionaries/it.json';
import zh from './dictionaries/zh.json';
import ur from './dictionaries/ur.json';
import ar from './dictionaries/ar.json';

/**
 * The English dictionary is the canonical shape. Every other locale is typed
 * against it, so a missing or misspelled key in a translation is a build-time
 * type error rather than a blank string in production.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  de,
  it,
  zh,
  ur,
  ar,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
