import { routing } from './routing';
import type { Locale } from './types';

function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

/**
 * Picks the highest-q supported locale from an Accept-Language header.
 * Returns null when no supported locale is acceptable (caller uses the default).
 */
export function pickLocaleFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  let best: { locale: Locale; q: number } | null = null;
  for (const part of header.split(',')) {
    const [rawTag, ...params] = part.trim().split(';');
    const primary = rawTag.trim().split('-')[0].toLowerCase();
    if (!isLocale(primary)) continue;
    let q = 1;
    for (const param of params) {
      const [key, value] = param.trim().split('=');
      if (key.trim().toLowerCase() === 'q') {
        const parsed = Number(value);
        q =
          value !== undefined && Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0;
      }
    }
    if (q <= 0) continue;
    // Strictly greater keeps header order for equal q.
    if (!best || q > best.q) best = { locale: primary, q };
  }
  return best?.locale ?? null;
}

interface HomeRedirectInput {
  pathname: string;
  cookieLocale: string | undefined | null;
  acceptLanguage: string | null;
}

/** Returns 'uk' when the home page request should be redirected to /uk, else null. */
export function resolveHomeRedirect({
  pathname,
  cookieLocale,
  acceptLanguage,
}: HomeRedirectInput): 'uk' | null {
  if (pathname !== '/') return null;
  if (cookieLocale === 'uk') return 'uk';
  if (cookieLocale === 'en') return null;
  return pickLocaleFromAcceptLanguage(acceptLanguage) === 'uk' ? 'uk' : null;
}
