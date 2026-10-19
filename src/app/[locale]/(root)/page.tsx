import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { About } from '@/components/about/About';
import { Faq } from '@/components/faq/Faq';
import { Hero } from '@/components/hero/Hero';
import { HowItWorks } from '@/components/howItWorks/HowItWorks';
import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { Portfolio } from '@/components/portfolio/Portfolio';
import { Services } from '@/components/services/Services';
// import { TechStack } from '@/components/techStack/TechStack';
import { WhyChoose } from '@/components/whyChoose/WhyChoose';
import { getFaq } from '@/content/faqContent';
import { getHowItWorks } from '@/content/howItWorksContent';
import { getPortfolio } from '@/content/portfolioContent';
import { getServiceFeatures, getServices } from '@/content/servicesContent';
import { getWhyChoose } from '@/content/whyChooseContent';
import { buildPageMetadata } from '@/i18n/metadata';
import type { Locale } from '@/i18n/types';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta.home' });

  const metadata = buildPageMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
  });

  // Home title is already complete, so skip the root " | Web41 Agency" template.
  return { ...metadata, title: { absolute: t('title') } };
};

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tPortfolio = await getTranslations('PortfolioPreview');

  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <About />
      <WhyChoose content={getWhyChoose(locale)} />
      <Services content={getServices(locale)} featuresContent={getServiceFeatures(locale)} />
      {/* <TechStack /> */}
      <Portfolio
        content={{ ...getPortfolio(locale), sectionTitle: tPortfolio('title') }}
        labels={{
          previous: tPortfolio('previous'),
          next: tPortfolio('next'),
          readCaseStudy: tPortfolio('readCaseStudy'),
        }}
      />
      <HowItWorks content={getHowItWorks(locale)} />
      <Faq content={getFaq(locale)} />
      <LetsTalk />
    </div>
  );
}
