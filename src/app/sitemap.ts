import type { MetadataRoute } from 'next';

import { caseStudies } from '@/content/caseStudiesContent';
import { SITE_URL } from '@/utils/site';

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
  ...caseStudies.map(({ slug }) => ({
    path: `/portfolio/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
