import type { Metadata } from 'next';

import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/utils/site';

import { routing } from './routing';
import type { Locale } from './types';

type OpenGraphType = 'website' | 'article';
type OgImages = NonNullable<NonNullable<Metadata['openGraph']>['images']>;

interface PageMetadataInput {
  locale: Locale;
  /** Locale-less path, e.g. '/', '/services', '/portfolio/calmisu'. */
  path: string;
  title: string;
  description: string;
  ogType?: OpenGraphType;
  images?: OgImages;
}

export const OG_LOCALES = { en: 'en_US', uk: 'uk_UA' } as const satisfies Record<Locale, string>;

/**
 * Absolute URL of `path` in `locale` (localePrefix 'as-needed': en unprefixed, uk under /uk).
 * No trailing slash anywhere: en home is SITE_URL, uk home is `${SITE_URL}/uk`.
 */
export function localeUrl(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  return `${SITE_URL}${prefix}${clean}`;
}

/** hreflang map for a path: every locale plus `x-default` pointing at the default locale. */
export function localeLanguages(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, path)])),
    'x-default': localeUrl(routing.defaultLocale, path),
  };
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogType = 'website',
  images = [DEFAULT_OG_IMAGE],
}: PageMetadataInput): Metadata {
  const url = localeUrl(locale, path);
  const alternateLocale = routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]);
  const firstImage = Array.isArray(images) ? images[0] : images;
  const twitterImage =
    typeof firstImage === 'string' || firstImage instanceof URL ? firstImage : firstImage?.url;

  return {
    title,
    description,
    alternates: { canonical: url, languages: localeLanguages(path) },
    // Next merges metadata shallowly: this replaces the root openGraph/twitter, so repeat everything.
    openGraph: {
      type: ogType,
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}
