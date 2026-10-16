'use client';

import { useReducedMotion } from 'motion/react';

import type { TechStackItem } from '@/content/techStackIconsArray';

import { MySlider } from '../slider/Slider';
import { Icon } from '../ui/Icon';

interface TechStackProps {
  title: string;
  items: TechStackItem[];
}

export const TechStack: React.FC<TechStackProps> = ({ title, items: techStack }) => {
  const reduceMotion = useReducedMotion();

  return (
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
          className="w-auto marquee"
          config={{
            slidesPerView: 10,
            spaceBetween: 16,
            loop: true,
            freeMode: true,
            autoplay: reduceMotion ? false : { delay: 0 },
            speed: 6800,
            breakpoints: {
              320: { slidesPerView: 3 }, // For mobile screens
              480: { slidesPerView: 4 }, // Small tablets
              768: { slidesPerView: 6 }, // Tablets
              1024: { slidesPerView: 8 }, // Small laptops
              1280: { slidesPerView: 10 }, // Large screens
            },
          }}
          slide={(item) => (
            <Icon id={item.id} height={60} label={item.label} className="w-full max-w-[130px]" />
          )}
        />
      </div>
      {/* <ul className="flex  justify-between items-center gap-12 w-full">
        {techStack.slice(0, 4).map((item, index) => (
          <li key={index.toString() + item.id} className="w-full max-w-1/4">
            <Icon id={item.id} className="w-full" />
          </li>
        ))}
      </ul> */}
    </section>
  );
};
