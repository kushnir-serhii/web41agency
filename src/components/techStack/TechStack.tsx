import type { TechStackItem } from '@/content/techStackIconsArray';

import { MySlider } from '../slider/Slider';
import { Icon } from '../ui/Icon';

interface TechStackProps {
  title: string;
  items: TechStackItem[];
}

export const TechStack: React.FC<TechStackProps> = ({ title, items: techStack }) => (
  <section className="flex flex-col justify-between gap-10 lg:gap-20 py-20 lg:py-40 w-full max-w-[1440px]">
    <h2 className="container mr-auto text-4xl lg:text-6xl font-semibold text-left text-black">
      {title}
    </h2>
    <div className="relative w-full">
      <div
        aria-hidden="true"
        className="absolute flex z-10 top-0 h-full gradient-techstack_slider w-full"
      />
      <MySlider
        contentArray={techStack}
        itemClassName="w-24 md:w-28 xl:w-[130px]"
        slide={(item) => <Icon id={item.id} height={60} label={item.label} className="w-full" />}
      />
    </div>
  </section>
);
