import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { About } from '@/components/about/About';
import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { PageHero } from '@/components/pageHero/PageHero';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { getPortfolio } from '@/content/portfolioContent';
import { buildPageMetadata } from '@/i18n/metadata';
import type { Locale } from '@/i18n/types';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta.portfolio' });

  return buildPageMetadata({
    locale,
    path: '/portfolio',
    title: t('title'),
    description: t('description'),
  });
};

export default async function PortfolioPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations('PortfolioPage');

  return (
    <div className="flex flex-col items-center w-full">
      <PageHero
        heading={[
          { text: t('headingLead'), muted: true },
          { text: t('headingMain') },
          { text: t('headingTail'), muted: true },
        ]}
        description={t('description')}
        hideSecondary
      />
      <PortfolioGrid projects={getPortfolio(locale).projects} />
      <About />
      <LetsTalk />
    </div>
  );
}
