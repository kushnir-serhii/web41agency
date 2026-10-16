/* Text-only: no image or next/* imports, so it is safe to import from server routes. */
import type { Locale } from '@/i18n/types';

/* Same order as the portfolio cards. Slugs are identical across locales. */
export const caseStudySlugs = [
  'ai-movie-matching',
  'calmisu',
  'catoshi',
  'nuance',
  'meridian-coffee-shop',
  'meme-academy',
  'investico',
  'qa-freelancer-website',
  'full-stack-developer-portfolio',
  'low-code-landing-page',
  'construction-company-website',
  'digital-marketing-website',
  'designer-portfolio',
] as const;

export type CaseStudySlug = (typeof caseStudySlugs)[number];

export const isCaseStudySlug = (slug: string): slug is CaseStudySlug =>
  (caseStudySlugs as readonly string[]).includes(slug);

export interface ICaseStudyTitle {
  slug: CaseStudySlug;
  title: string;
}

/* Short titles: hero, breadcrumb, "next project" link and the chat knowledge base (en). */
const caseStudyTitleCopy = {
  en: {
    'ai-movie-matching': 'AI Movie Matching App',
    calmisu: 'Calmisu',
    catoshi: 'Catoshi',
    nuance: 'Nuance',
    'meridian-coffee-shop': 'Meridian Coffee Shop',
    'meme-academy': 'Meme Academy',
    investico: 'Investico',
    'qa-freelancer-website': 'QA Freelancer Website',
    'full-stack-developer-portfolio': 'Full Stack Developer Portfolio',
    'low-code-landing-page': 'Low-Code Mobile Development Landing Page',
    'construction-company-website': 'Construction Company Website',
    'digital-marketing-website': 'Digital Marketing Website',
    'designer-portfolio': 'Designer’s Portfolio',
  },
  uk: {
    'ai-movie-matching': 'AI-застосунок для підбору фільмів',
    calmisu: 'Calmisu',
    catoshi: 'Catoshi',
    nuance: 'Nuance',
    'meridian-coffee-shop': 'Meridian Coffee Shop',
    'meme-academy': 'Meme Academy',
    investico: 'Investico',
    'qa-freelancer-website': 'Сайт QA-фрилансера',
    'full-stack-developer-portfolio': 'Портфоліо full stack розробника',
    'low-code-landing-page': 'Лендінг low-code мобільної розробки',
    'construction-company-website': 'Сайт будівельної компанії',
    'digital-marketing-website': 'Сайт агенції цифрового маркетингу',
    'designer-portfolio': 'Портфоліо дизайнера',
  },
} satisfies Record<Locale, Record<CaseStudySlug, string>>;

export function getCaseStudyTitle(slug: CaseStudySlug, locale: Locale): string {
  return caseStudyTitleCopy[locale][slug];
}

export function getCaseStudyTitles(locale: Locale): ICaseStudyTitle[] {
  return caseStudySlugs.map((slug) => ({ slug, title: caseStudyTitleCopy[locale][slug] }));
}
