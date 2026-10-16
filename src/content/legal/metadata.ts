import type { Metadata } from 'next';

import { buildPageMetadata, localeUrl } from '@/i18n/metadata';
import type { Locale } from '@/i18n/types';
import { SITE_URL } from '@/utils/site';

import type { LegalDocument } from './types';

export function buildLegalMetadata(doc: LegalDocument, locale: Locale): Metadata {
  return {
    ...buildPageMetadata({
      locale,
      path: `/${doc.slug}`,
      title: doc.title,
      description: doc.description,
    }),
    robots: { index: true, follow: true },
  };
}

export function buildLegalJsonLd(doc: LegalDocument, locale: Locale, homeName: string) {
  const url = localeUrl(locale, `/${doc.slug}`);
  const homeUrl = localeUrl(locale, '/');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: doc.title,
        description: doc.description,
        dateModified: doc.lastUpdated,
        isPartOf: SITE_URL,
        inLanguage: locale,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: homeName, item: homeUrl },
          { '@type': 'ListItem', position: 2, name: doc.title, item: url },
        ],
      },
    ],
  };
}
