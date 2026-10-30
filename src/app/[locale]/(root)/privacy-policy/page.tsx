import type { Metadata } from 'next';

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

  return buildLegalMetadata(getLegalDocument('privacy-policy', locale), locale);
};

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return <LegalPage doc={getLegalDocument('privacy-policy', locale)} locale={locale} />;
}
