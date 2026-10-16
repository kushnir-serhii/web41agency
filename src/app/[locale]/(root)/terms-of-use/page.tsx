import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LegalPage } from '@/components/legal';
import { getLegalDocument } from '@/content/legal';
import { buildLegalMetadata } from '@/content/legal/metadata';
import type { Locale } from '@/i18n/types';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return buildLegalMetadata(getLegalDocument('terms-of-use', locale), locale);
};

export default async function TermsOfUsePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPage doc={getLegalDocument('terms-of-use', locale)} locale={locale} />;
}
