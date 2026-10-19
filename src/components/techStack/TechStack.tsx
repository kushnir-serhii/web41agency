import { getTranslations } from 'next-intl/server';

import type { TechStackItem } from '@/content/techStackIconsArray';

import { MarqueeRegion } from '../slider/MarqueeRegion';
import { MySlider } from '../slider/Slider';
import { Icon } from '../ui/Icon';
import { SectionHeading } from '../ui/SectionHeading';

interface TechStackProps {
  title: string;
  items: TechStackItem[];
}

export const TechStack = async ({ title, items: techStack }: TechStackProps) => {
  const t = await getTranslations('Marquee');

  return (
    <section className="section-y flex flex-col justify-between gap-10 lg:gap-20 w-full max-w-[1440px]">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-20">
        <SectionHeading>{title}</SectionHeading>
      </div>
      <MarqueeRegion
        className="w-full"
        pauseLabel={t('pause')}
        playLabel={t('play')}
        toggleClassName="lg:right-20"
      >
        <div
          aria-hidden="true"
          className="absolute flex z-10 top-0 h-full gradient-techstack_slider w-full pointer-events-none"
        />
        <MySlider
          contentArray={techStack}
          itemClassName="w-24 md:w-28 xl:w-[130px]"
          slide={(item) => <Icon id={item.id} height={60} label={item.label} className="w-full" />}
        />
      </MarqueeRegion>
    </section>
  );
};
