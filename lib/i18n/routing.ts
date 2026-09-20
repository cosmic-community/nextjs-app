// lib/i18n/routing.ts
// Helpers for building locale-aware URLs and for RTL-safe styling.

import type { Locale } from './config';
import { defaultLocale, isLocale, locales } from './config';

/**
 * Prefix a path with its locale segment.
 * localizedPath('en', '/projects') -> '/en/projects'
 *
 * We prefix every locale including the default. It costs one redirect on the
 * bare '/' but keeps routing rules uniform and makes hreflang unambiguous,
 * which matters more for an audience of international recruiters.
 */
export function localizedPath(locale: Locale, path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `/${locale}`;
  return `/${locale}${clean}`;
}

/**
 * Strip the locale segment from a pathname, returning the rest.
 * '/de/projects' -> '/projects'
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname || '/';
}

/** Read the active locale out of a pathname, falling back to the default. */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return first && isLocale(first) ? first : defaultLocale;
}

/**
 * Negotiate the best locale from an Accept-Language header.
 * Deliberately dependency-free: the full Intl.LocaleMatcher dance is overkill
 * for six locales, and negotiator/formatjs would add client-irrelevant weight.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return {
        tag: (tag ?? '').trim().toLowerCase(),
        q: q ? Number.parseFloat(q) : 1,
      };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // Exact match first (e.g. 'de'), then the primary subtag (e.g. 'de-AT' -> 'de').
    const exact = locales.find((l) => l === tag);
    if (exact) return exact;

    const primary = tag.split('-')[0];
    const partial = locales.find((l) => l === primary);
    if (partial) return partial;
  }

  return defaultLocale;
}

/** All locales except the given one. Used to emit alternate hreflang links. */
export function otherLocales(current: Locale): Locale[] {
  return locales.filter((l) => l !== current);
}
