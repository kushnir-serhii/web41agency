import { getTranslations } from 'next-intl/server';

import { caseStudySlugs } from '@/content/caseStudyTitles';

import { Button } from '../ui/Button';

interface IFact {
  id: 'projects' | 'experience' | 'industries';
  accent: boolean;
  /* Position inside the facts box, as a percentage of its width/height —
     the same staggered triangle on mobile and desktop. */
  position: string;
}

const facts: IFact[] = [
  {
    id: 'projects',
    accent: true,
    position: 'left-[65.1%] top-0',
  },
  {
    id: 'experience',
    accent: true,
    position: 'left-0 top-[36.4%]',
  },
  {
    id: 'industries',
    accent: false,
    position: 'left-[34.9%] top-[64.7%]',
  },
];

export const About = async () => {
  const t = await getTranslations('About');
  const values = {
    projects: String(caseStudySlugs.length),
    experience: t('experienceValue'),
    industries: t('industriesValue'),
  };
  const labels = {
    projects: t('projectsLabel'),
    experience: t('experienceLabel'),
    industries: t('industriesLabel'),
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16 xl:gap-[223px] px-4 lg:px-20 py-20 lg:py-40">
      <div className="flex flex-col items-start w-full lg:w-[45%] xl:w-[428.53px] gap-6 lg:gap-10">
        <h2 className="w-full text-4xl lg:text-6xl font-bold text-left text-black">{t('title')}</h2>
        <div className="w-full flex flex-col gap-4 opacity-80 text-lg text-left text-black">
          <p>{t('intro')}</p>
          <p>{t('details')}</p>
        </div>
        <Button text={t('button')} />
      </div>

      {/* The circles run into the section's bottom padding, as in the design */}
      <div className="relative w-full lg:w-1/2 xl:w-[631px] aspect-[631/623] shrink-0 lg:-mb-40">
        {facts.map(({ id, accent, position }) => (
          <div
            key={id}
            className={`absolute flex flex-col justify-center items-center w-[34.9%] aspect-square rounded-full
              ${position} ${accent ? 'bg-accent' : 'bg-bg_item'}`}
          >
            <p className="w-full text-xl lg:text-[32px] font-bold text-center text-black">
              {values[id]}
            </p>
            <p className="w-full text-xs lg:text-lg text-center text-black">{labels[id]}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
