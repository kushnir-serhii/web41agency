'use client';

import 'swiper/css';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperCore } from 'swiper/types';

import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IProject } from '@/content/portfolioContent';

import { ProjectCard } from './portfolioComponents/ProjectCard';

interface PortfolioProps {
  content: {
    sectionTitle: string;
    projects: IProject[];
  };
  labels: { previous: string; next: string; readCaseStudy: string };
}

export const Portfolio: React.FC<PortfolioProps> = ({ content, labels }) => {
  const { sectionTitle, projects } = content;
  const t = useTranslations('PortfolioPreview');
  const swiperRef = useRef<SwiperCore | null>(null);
  const [position, setPosition] = useState({ index: 0, isBeginning: true, isEnd: false });

  const syncPosition = (swiper: SwiperCore) =>
    setPosition({
      index: swiper.activeIndex,
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });

  return (
    <section className="w-full bg-bg_item section-y">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 flex flex-col gap-6">
        <div className="flex justify-between items-center gap-4 w-full">
          <SectionHeading>{sectionTitle}</SectionHeading>

          <div className="flex items-center gap-2">
            <p
              aria-live="polite"
              aria-label={t('position', { current: position.index + 1, total: projects.length })}
              className="mr-2 shrink-0 whitespace-nowrap text-base text-black/70"
            >
              {position.index + 1} / {projects.length}
            </p>
            <button
              type="button"
              aria-label={labels.previous}
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={position.isBeginning}
              className="flex size-11 items-center justify-center rounded-full bg-white/75 cursor-pointer transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon id="icon-arrow" width={20} height={20} />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => swiperRef.current?.slideNext()}
              disabled={position.isEnd}
              className="flex size-11 items-center justify-center rounded-full bg-white/75 cursor-pointer transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon id="icon-arrow" width={20} height={20} className="rotate-180" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            syncPosition(swiper);
          }}
          onSlideChange={syncPosition}
          onResize={syncPosition}
          spaceBetween={24}
          slidesPerView={1.1}
          breakpoints={{
            640: { slidesPerView: 1.6 },
            1024: { slidesPerView: 2.4 },
            1280: { slidesPerView: 3.27 },
          }}
          className="w-full"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.title} className="h-auto">
              <ProjectCard {...project} readLabel={labels.readCaseStudy} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
