import { getTranslations } from 'next-intl/server';

import { caseStudySlugs } from '@/content/caseStudyTitles';
import { CONSULTATION_HREF } from '@/content/ctaLinks';

import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

interface IFact {
  id: 'projects' | 'ownership' | 'speed' | 'industries' | 'response';
  accent: boolean;
  /* Desktop position inside the facts box, as a percentage of its
     width/height — a staggered cluster around the accent circle. */
  position: string;
  /* Mobile grid placement (6-col grid, each circle spans 2 → 3 + 2 centred). */
  mobile?: string;
}

const facts: IFact[] = [
  {
    id: 'projects',
    accent: true,
    position: 'lg:left-[62%] lg:top-0',
  },
  {
    id: 'ownership',
    accent: false,
    position: 'lg:left-[8%] lg:top-[10.2%]',
  },
  {
    id: 'speed',
    accent: true,
    position: 'lg:left-[35%] lg:top-[36.7%]',
  },
  {
    id: 'industries',
    accent: false,
    position: 'lg:left-[70%] lg:top-[63.3%]',
    mobile: 'col-start-2 lg:col-start-auto',
  },
  {
    id: 'response',
    accent: true,
    position: 'lg:left-[2%] lg:top-[67.3%]',
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
    ownership: t('ownershipValue'),
    speed: t('speedValue'),
    industries: t('industriesValue'),
    response: t('responseValue'),
  };
  const labels = {
    projects: t('projectsLabel'),
    ownership: t('ownershipLabel'),
    speed: t('speedLabel'),
    industries: t('industriesLabel'),
    response: t('responseLabel'),
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16 xl:gap-20 px-4 lg:px-20 section-y">
      <div className="flex flex-col items-start w-full lg:w-[45%] xl:w-[480px] gap-6 lg:gap-10">
        <SectionHeading as={headingLevel}>{t('title')}</SectionHeading>
        <div className="w-full flex flex-col gap-4 opacity-80 text-lg text-left text-black">
          <p>{t('intro')}</p>
          <p>{t('details')}</p>
          <p>{t('closing')}</p>
        </div>
        <Button text={tCta('freeQuote')} href={CONSULTATION_HREF} />
      </div>

      <div className="relative grid grid-cols-6 gap-2 md:gap-4 w-full max-w-[560px] lg:block lg:max-w-none lg:w-1/2 xl:w-[600px] lg:aspect-[100/98] shrink-0">
        {facts.map(({ id, accent, position, mobile = '' }) => (
          <div
            key={id}
            className={`col-span-2 lg:absolute flex flex-col justify-center items-center px-2 lg:px-3 w-full lg:w-[30%] aspect-square rounded-full
              ${position} ${mobile} ${accent ? 'bg-accent' : 'bg-bg_item ring-1 ring-inset ring-black/10'}`}
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
