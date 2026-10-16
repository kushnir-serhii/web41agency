import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { WhyChoose } from '@/components/whyChoose/WhyChoose';
import { getWhyChoose } from '@/content/whyChooseContent';
import { buildPageMetadata } from '@/i18n/metadata';
import type { Locale } from '@/i18n/types';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta.aboutUs' });

  return buildPageMetadata({
    locale,
    path: '/about-us',
    title: t('title'),
    description: t('description'),
  });
};

export default async function AboutUsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container flex-col">
      <WhyChoose content={getWhyChoose(locale)} />
      <LetsTalk />
    </div>
  );
}
