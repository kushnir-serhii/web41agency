import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { PageHero } from '@/components/pageHero/PageHero';
import { Services } from '@/components/services/Services';
import { getServiceFeatures, getServices } from '@/content/servicesContent';
import { buildPageMetadata } from '@/i18n/metadata';
import type { Locale } from '@/i18n/types';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta.services' });

  return buildPageMetadata({
    locale,
    path: '/services',
    title: t('title'),
    description: t('description'),
  });
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ServicesPage');

  return (
    <div className="flex flex-col items-center w-full">
      <PageHero
        heading={[{ text: t('headingMain') }, { text: t('headingMuted'), muted: true }]}
        description={t('description')}
      />
      <Services
        content={getServices(locale)}
        featuresContent={getServiceFeatures(locale)}
        hideTitle
      />
      <LetsTalk />
    </div>
  );
}
