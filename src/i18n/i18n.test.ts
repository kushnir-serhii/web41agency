/*
 * @spec: 005-multilingual-site-ukrainian - acceptance traceability for pure i18n logic.
 * 2.4 no untranslated UI ............... message key parity (en.json vs uk.json)
 * 2.4 uk legal date format ............. formatLegalDate, legal lastUpdated parity, prevailing note
 * 2.4/2.7 titles, previews, hreflang ... buildPageMetadata, localeUrl, localeLanguages
 * 2.7 site map lists both languages .... sitemap()
 * 2.3 first-visit language ............. pickLocaleFromAcceptLanguage, resolveHomeRedirect, proxy
 * MANUAL: owner proofreading of the Ukrainian copy (2.4 quality).
 */
import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import sitemap from '@/app/sitemap';
import { legalDocuments } from '@/content/legal';
import { formatLegalDate } from '@/content/legal/utils';
import { SITE_URL } from '@/utils/site';

import messagesEn from '../../messages/en.json';
import messagesUk from '../../messages/uk.json';
import { pickLocaleFromAcceptLanguage, resolveHomeRedirect } from './detectLocale';
import { buildPageMetadata, localeLanguages, localeUrl } from './metadata';

// next-intl's ESM build cannot resolve `next/server` under Vitest; its routing is a pass-through here.
vi.mock('next-intl/middleware', () => ({ default: () => () => NextResponse.next() }));

const TAGS = '@spec:005-multilingual-site-ukrainian @regression';

function leafValues(node: unknown): Map<string, unknown> {
  const out = new Map<string, unknown>();
  const walk = (n: unknown, p: string) => {
    if (n === null || typeof n !== 'object') out.set(p, n);
    else for (const [k, v] of Object.entries(n)) walk(v, p ? `${p}.${k}` : k);
  };
  walk(node, '');
  return out;
}

describe(`${TAGS} message key parity`, () => {
  const en = [...leafValues(messagesEn).keys()].sort();
  const uk = [...leafValues(messagesUk).keys()].sort();

  it('uk.json has exactly the keys of en.json', () => {
    expect(uk.filter((k) => !en.includes(k))).toEqual([]);
    expect(en.filter((k) => !uk.includes(k))).toEqual([]);
  });

  it('every uk string is a non-empty string', () => {
    for (const [key, value] of leafValues(messagesUk)) {
      expect(typeof value, key).toBe('string');
      expect((value as string).trim().length, key).toBeGreaterThan(0);
    }
  });

  it('keeps ICU placeholders and rich-text tags identical in both languages', () => {
    const tokens = (s: string) => (s.match(/\{[^}]+\}|<\/?[a-z]+>/g) ?? []).sort();
    const ukValues = leafValues(messagesUk);
    for (const [key, value] of leafValues(messagesEn)) {
      expect(tokens(ukValues.get(key) as string), key).toEqual(tokens(value as string));
    }
  });

  it('translates the visitor-facing strings (not copied from English)', () => {
    expect(messagesUk.Nav.services).not.toBe(messagesEn.Nav.services);
    expect(messagesUk.Cta.freeQuote).not.toBe(messagesEn.Cta.freeQuote);
    expect(messagesUk.Chat.greeting).not.toBe(messagesEn.Chat.greeting);
    expect(messagesUk.LetsTalk.validation.nameRequired).not.toBe(
      messagesEn.LetsTalk.validation.nameRequired,
    );
  });
});

describe(`${TAGS} legal documents`, () => {
  it('has the same documents in both locales with identical lastUpdated', () => {
    expect(legalDocuments.uk.map((d) => d.slug)).toEqual(legalDocuments.en.map((d) => d.slug));
    for (const en of legalDocuments.en) {
      const uk = legalDocuments.uk.find((d) => d.slug === en.slug)!;
      expect(uk.lastUpdated).toBe(en.lastUpdated);
      expect(uk.sections).toHaveLength(en.sections.length);
    }
  });

  it('every uk document states that the English version prevails; en has no such note', () => {
    for (const doc of legalDocuments.uk) expect(doc.prevailingNote).toMatch(/англійськ/);
    for (const doc of legalDocuments.en) expect(doc.prevailingNote).toBeUndefined();
  });

  it('formatLegalDate writes Ukrainian long form on uk and English on en', () => {
    expect(formatLegalDate('2026-10-15', 'uk')).toBe('15 жовтня 2026 р.');
    expect(formatLegalDate('2026-10-15', 'en')).toBe('October 15, 2026');
  });
});

describe(`${TAGS} page metadata`, () => {
  it('localeUrl: en unprefixed, uk under /uk, no trailing slash', () => {
    expect(localeUrl('en', '/')).toBe(SITE_URL);
    expect(localeUrl('uk', '/')).toBe(`${SITE_URL}/uk`);
    expect(localeUrl('en', '/services')).toBe(`${SITE_URL}/services`);
    expect(localeUrl('uk', '/portfolio/calmisu')).toBe(`${SITE_URL}/uk/portfolio/calmisu`);
  });

  it('localeLanguages has en, uk and x-default (= en)', () => {
    expect(localeLanguages('/services')).toEqual({
      en: `${SITE_URL}/services`,
      uk: `${SITE_URL}/uk/services`,
      'x-default': `${SITE_URL}/services`,
    });
  });

  it('buildPageMetadata (uk): canonical, hreflang, Ukrainian title/description in OG and Twitter', () => {
    const meta = buildPageMetadata({
      locale: 'uk',
      path: '/services',
      title: 'Послуги',
      description: 'Опис',
    });
    expect(meta.title).toBe('Послуги');
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/uk/services`);
    expect(meta.alternates?.languages).toEqual(localeLanguages('/services'));
    expect(meta.openGraph).toMatchObject({
      locale: 'uk_UA',
      alternateLocale: ['en_US'],
      url: `${SITE_URL}/uk/services`,
      title: 'Послуги',
      description: 'Опис',
    });
    expect(meta.twitter).toMatchObject({ title: 'Послуги', description: 'Опис' });
  });

  it('buildPageMetadata (en): canonical is unprefixed and OG locale is en_US', () => {
    const meta = buildPageMetadata({ locale: 'en', path: '/', title: 'T', description: 'D' });
    expect(meta.alternates?.canonical).toBe(SITE_URL);
    expect(meta.openGraph).toMatchObject({ locale: 'en_US', alternateLocale: ['uk_UA'] });
  });
});

describe(`${TAGS} sitemap`, () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it('lists every route in both locales (20 routes x 2)', () => {
    expect(entries).toHaveLength(40);
    expect(new Set(urls).size).toBe(40);
    const enUrls = urls.filter((u) => u !== `${SITE_URL}/uk` && !u.startsWith(`${SITE_URL}/uk/`));
    expect(enUrls).toHaveLength(20);
    for (const en of enUrls) {
      const uk = en === SITE_URL ? `${SITE_URL}/uk` : en.replace(SITE_URL, `${SITE_URL}/uk`);
      expect(urls, en).toContain(uk);
    }
    expect(urls).toContain(`${SITE_URL}/uk/portfolio/calmisu`);
    expect(urls).toContain(`${SITE_URL}/uk/privacy-policy`);
  });

  it('every entry links both languages and x-default via alternates', () => {
    for (const entry of entries) {
      const langs = entry.alternates?.languages as Record<string, string>;
      expect(Object.keys(langs).sort(), entry.url).toEqual(['en', 'uk', 'x-default']);
      expect([langs.en, langs.uk], entry.url).toContain(entry.url);
      expect(langs['x-default']).toBe(langs.en);
      expect(entry.url.endsWith('/')).toBe(false);
    }
  });
});

describe(`${TAGS} language detection`, () => {
  it.each([
    ['uk', 'uk'],
    ['uk-UA,uk;q=0.9,en;q=0.8', 'uk'],
    ['en-US,en;q=0.9,uk;q=0.8', 'en'],
    ['en;q=0.5,uk;q=0.9', 'uk'],
    ['de-DE,fr;q=0.8', null],
    ['uk;q=0,en', 'en'],
    ['uk;q=abc', null],
    ['', null],
    [null, null],
  ])('pickLocaleFromAcceptLanguage(%j) -> %j', (header, expected) => {
    expect(pickLocaleFromAcceptLanguage(header as string | null)).toBe(expected);
  });

  it('resolveHomeRedirect: Ukrainian browser on / redirects, otherwise not', () => {
    const base = { pathname: '/', cookieLocale: undefined };
    expect(resolveHomeRedirect({ ...base, acceptLanguage: 'uk-UA,uk;q=0.9' })).toBe('uk');
    expect(resolveHomeRedirect({ ...base, acceptLanguage: 'en-US,en;q=0.9' })).toBeNull();
    expect(resolveHomeRedirect({ ...base, acceptLanguage: null })).toBeNull();
  });

  it('the saved choice wins over the browser language', () => {
    expect(
      resolveHomeRedirect({ pathname: '/', cookieLocale: 'en', acceptLanguage: 'uk' }),
    ).toBeNull();
    expect(resolveHomeRedirect({ pathname: '/', cookieLocale: 'uk', acceptLanguage: 'en' })).toBe(
      'uk',
    );
  });

  it.each(['/services', '/uk', '/uk/services', '/portfolio/calmisu'])(
    'direct link %s is never redirected',
    (pathname) => {
      expect(
        resolveHomeRedirect({ pathname, cookieLocale: 'uk', acceptLanguage: 'uk' }),
      ).toBeNull();
    },
  );
});

describe(`${TAGS} proxy`, () => {
  const run = async (path: string, headers: Record<string, string> = {}) => {
    const { default: proxy } = await import('@/proxy');
    return proxy(new NextRequest(`http://localhost${path}`, { headers }));
  };

  it('redirects / to /uk for a Ukrainian browser, with Vary and no cookie set', async () => {
    const res = await run('/', { 'accept-language': 'uk-UA,uk;q=0.9' });
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get('location')!).pathname).toBe('/uk');
    expect(res.headers.get('vary')).toContain('Accept-Language');
    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('does not redirect / for an English browser or when the cookie says en', async () => {
    const en = await run('/', { 'accept-language': 'en-US' });
    expect(en.headers.get('location')).toBeNull();
    const cookie = await run('/', { 'accept-language': 'uk', cookie: 'NEXT_LOCALE=en' });
    expect(cookie.headers.get('location')).toBeNull();
  });

  it('never redirects non-home paths, whatever the browser language', async () => {
    for (const p of ['/services', '/uk/services', '/uk']) {
      const res = await run(p, { 'accept-language': 'uk', cookie: 'NEXT_LOCALE=uk' });
      expect(res.headers.get('location'), p).toBeNull();
    }
  });
});
