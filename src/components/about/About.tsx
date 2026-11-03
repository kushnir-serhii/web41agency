import { getTranslations } from 'next-intl/server';

import { caseStudySlugs } from '@/content/caseStudyTitles';
import { CONSULTATION_HREF } from '@/content/ctaLinks';
import { aiProjectCount } from '@/content/portfolioContent';

import { Button } from '../ui/Button';
import { Magnetic } from '../ui/Magnetic';
import { SectionHeading } from '../ui/SectionHeading';

interface IFact {
  id: 'ownership' | 'ai' | 'projects' | 'speed' | 'response' | 'support' | 'seo';
  accent: boolean;
  /* Desktop position inside the facts box, as a percentage of its
     width/height — a 2-3-2 honeycomb with the two lime circles on a diagonal. */
  position: string;
  /* Mobile grid placement (4-col grid below sm → 2+2+2+1; 6-col from sm → 3+3+1), last one centred. */
  mobile?: string;
}

/* Array order is the mobile reading order: lime circles land on a diagonal in the 2-col grid. */
const facts: IFact[] = [
  { id: 'ownership', accent: true, position: 'lg:left-[18%] lg:top-0' },
  { id: 'ai', accent: false, position: 'lg:left-[36.5%] lg:top-[34%]' },
  { id: 'projects', accent: false, position: 'lg:left-[55%] lg:top-[2%]' },
  { id: 'speed', accent: true, position: 'lg:left-[55%] lg:top-[68%]' },
  { id: 'response', accent: false, position: 'lg:left-0 lg:top-[36%]' },
  { id: 'support', accent: false, position: 'lg:left-[73%] lg:top-[32%]' },
  {
    id: 'seo',
    accent: false,
    position: 'lg:left-[18%] lg:top-[70%]',
    mobile: 'col-start-2 sm:col-start-3 lg:col-start-auto',
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
    ownership: t('ownershipValue'),
    ai: String(aiProjectCount),
    projects: String(caseStudySlugs.length),
    speed: t('speedValue'),
    response: t('responseValue'),
    support: t('supportValue'),
    seo: t('seoValue'),
  };
  const labels = {
    ownership: t('ownershipLabel'),
    ai: t('aiLabel'),
    projects: t('projectsLabel'),
    speed: t('speedLabel'),
    response: t('responseLabel'),
    support: t('supportLabel'),
    seo: t('seoLabel'),
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

      <div className="relative grid grid-cols-4 sm:grid-cols-6 gap-2 md:gap-4 w-full max-w-[560px] lg:block lg:max-w-none lg:w-1/2 xl:w-[600px] lg:aspect-[100/98] shrink-0">
        {facts.map(({ id, accent, position, mobile = '' }) => (
          <Magnetic
            key={id}
            className={`col-span-2 lg:absolute flex flex-col justify-center items-center px-3 lg:px-3 w-full lg:w-[27%] aspect-square rounded-full
              ${position} ${mobile} ${accent ? 'bg-accent' : 'bg-mist ring-1 ring-inset ring-black/10'}`}
          >
            <p className="w-full text-2xl md:text-3xl lg:text-[32px] font-bold text-center text-black">
              {values[id]}
            </p>
            <p className="w-full text-sm lg:text-base leading-tight text-center text-balance text-black">
              {labels[id]}
            </p>
          </Magnetic>
        ))}
      </div>
    </section>
  );
};
