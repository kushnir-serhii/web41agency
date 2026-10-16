import type { Locale } from '@/i18n/types';

import { privacyPolicy } from './privacy';
import { privacyPolicyUk } from './privacy.uk';
import { termsOfUse } from './terms';
import { termsOfUseUk } from './terms.uk';
import type { LegalDocument, LegalSlug } from './types';

export const legalDocuments: Record<Locale, LegalDocument[]> = {
  en: [privacyPolicy, termsOfUse],
  uk: [privacyPolicyUk, termsOfUseUk],
};

export function getLegalDocument(slug: LegalSlug, locale: Locale): LegalDocument {
  const doc = legalDocuments[locale].find((item) => item.slug === slug);
  if (!doc) throw new Error(`Unknown legal document "${slug}"`);
  return doc;
}

export function getOtherLegalDocs(slug: LegalSlug, locale: Locale): LegalDocument[] {
  return legalDocuments[locale].filter((doc) => doc.slug !== slug);
}
