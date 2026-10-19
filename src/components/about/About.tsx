import { getTranslations } from 'next-intl/server';

import { caseStudySlugs } from '@/content/caseStudyTitles';
import { CONSULTATION_HREF } from '@/content/ctaLinks';

import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

interface IFact {
  id: 'projects' | 'speed' | 'industries';
  accent: boolean;
  /* Position inside the facts box, as a percentage of its width/height —
     the same staggered triangle on mobile and desktop. */
  position: string;
}

const facts: IFact[] = [
  {
    id: 'projects',
    accent: false,
    position: 'lg:left-[65.1%] lg:top-0',
  },
  {
    id: 'speed',
    accent: true,
    position: 'lg:left-0 lg:top-[36.4%]',
  },
  {
    id: 'industries',
    accent: false,
    position: 'lg:left-[34.9%] lg:top-[64.7%]',
  },
];

interface AboutProps {
  /* h1 when the section opens the About Us page; h2 everywhere else. */
  headingLevel?: 'h1' | 'h2';
}

export const About = async ({ headingLevel = 'h2' }: AboutProps) => {
  const t = await getTranslations('About');
  const tCta = await getTranslations('Cta');
  const values = {
    projects: String(caseStudySlugs.length),
    speed: t('speedValue'),
    industries: t('industriesValue'),
  };
  const labels = {
    projects: t('projectsLabel'),
    speed: t('speedLabel'),
    industries: t('industriesLabel'),
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16 xl:gap-20 px-4 lg:px-20 section-y">
      <div className="flex flex-col items-start w-full lg:w-[45%] xl:w-[480px] gap-6 lg:gap-10">
        <SectionHeading as={headingLevel}>{t('title')}</SectionHeading>
        <div className="w-full flex flex-col gap-4 opacity-80 text-lg text-left text-black">
          <p>{t('intro')}</p>
          <p>{t('details')}</p>
        </div>
        <Button text={tCta('freeQuote')} href={CONSULTATION_HREF} />
      </div>

      <div className="relative grid grid-cols-3 gap-2 md:gap-4 w-full max-w-[560px] lg:block lg:max-w-none lg:w-1/2 xl:w-[600px] lg:aspect-[631/623] shrink-0">
        {facts.map(({ id, accent, position }) => (
          <div
            key={id}
            className={`lg:absolute flex flex-col justify-center items-center px-2 lg:px-0 w-full lg:w-[34.9%] aspect-square rounded-full
              ${position} ${accent ? 'bg-accent' : 'bg-bg_item ring-1 ring-inset ring-black/10'}`}
          >
            <p className="w-full text-2xl md:text-3xl lg:text-[32px] font-bold text-center text-black">
              {values[id]}
            </p>
            <p className="w-full text-sm lg:text-lg leading-tight text-center text-black">
              {labels[id]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
