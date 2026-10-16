import type { MetadataRoute } from 'next';

import { caseStudySlugs } from '@/content/caseStudyTitles';
import { legalDocuments } from '@/content/legal';
import { localeLanguages, localeUrl } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/**
 * Only pages with real content belong here.
 */
const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contacts', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about-us', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms-of-use', priority: 0.2, changeFrequency: 'yearly' },
  // Case studies are generated from content, so the sitemap grows with them.
  ...caseStudySlugs.map((slug) => ({
    path: `/portfolio/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const legalDates = new Map(legalDocuments.en.map((doc) => [`/${doc.slug}`, doc.lastUpdated]));

  return ROUTES.flatMap(({ path, priority, changeFrequency }) => {
    const languages = localeLanguages(path);

    return routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: legalDates.get(path) ?? now,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
