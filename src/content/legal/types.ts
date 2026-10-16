export type LegalSlug = 'privacy-policy' | 'terms-of-use';

export interface LegalSectionData {
  id?: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  slug: LegalSlug;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD */
  lastUpdated: string;
  /** Exactly 4 "At a glance" points */
  summary: string[];
  intro: string[];
  sections: LegalSectionData[];
  /** Shown only on non-English versions: states that the English text prevails. */
  prevailingNote?: string;
}
