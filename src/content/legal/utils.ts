import type { Locale } from '@/i18n/types';
import { slugify } from '@/utils/slugify';

import type { LegalDocument, LegalSectionData } from './types';

export interface TocItem {
  id: string;
  label: string;
  number: string;
}

const WORDS_PER_MINUTE = 200;

export function getSectionId(section: LegalSectionData): string {
  return section.id ?? slugify(section.heading);
}

export function getTocItems(doc: LegalDocument): TocItem[] {
  const seen = new Set<string>();

  return doc.sections.map((section, index) => {
    const id = getSectionId(section);

    if (seen.has(id)) {
      throw new Error(`Duplicate legal section id "${id}" in "${doc.slug}"`);
    }
    seen.add(id);

    return {
      id,
      label: section.heading,
      number: String(index + 1).padStart(2, '0'),
    };
  });
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function getReadingMinutes(doc: LegalDocument): number {
  const texts = [
    ...doc.summary,
    ...doc.intro,
    ...doc.sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.list ?? []),
    ]),
  ];
  const words = texts.reduce((sum, text) => sum + countWords(text), 0);

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }),
  uk: new Intl.DateTimeFormat('uk-UA', { dateStyle: 'long', timeZone: 'UTC' }),
};

export function formatLegalDate(iso: string, locale: Locale): string {
  return dateFormatters[locale].format(new Date(`${iso}T00:00:00Z`));
}
