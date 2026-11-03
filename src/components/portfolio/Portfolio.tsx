'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

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

const controlClass =
  'flex size-11 items-center justify-center rounded-full bg-white border border-black/10 cursor-pointer transition-colors hover:bg-black hover:text-white hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black disabled:hover:border-black/10';

// Slide widths reproduce the former Swiper layout: 1.1 / 1.6 / 2.4 / 3.27 per view, 24px gap.
const itemClass =
  'shrink-0 snap-start basis-[calc((100%-24px*0.1)/1.1)] sm:basis-[calc((100%-24px*0.6)/1.6)] lg:basis-[calc((100%-24px*1.4)/2.4)] xl:basis-[calc((100%-24px*2.27)/3.27)]';

/* Up to ~3 slides are in view on first paint (xl); the rest stay lazy. */
const EAGER_CARDS = 3;

export const Portfolio: React.FC<PortfolioProps> = ({ content, labels }) => {
  const { sectionTitle, projects } = content;
  const total = projects.length;
  const t = useTranslations('PortfolioPreview');
  const listRef = useRef<HTMLUListElement | null>(null);
  const [position, setPosition] = useState({ current: 1, isBeginning: true, isEnd: total <= 1 });
  const [announcement, setAnnouncement] = useState('');

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];
    // First card whose right half is in view.
    const firstVisible = items.findIndex(
      (item) => item.offsetLeft + item.offsetWidth * 0.5 >= list.scrollLeft - 1,
    );
    const current = firstVisible === -1 ? 1 : firstVisible + 1;
    const isBeginning = list.scrollLeft <= 1;
    const isEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
    setPosition((prev) =>
      prev.current === current && prev.isBeginning === isBeginning && prev.isEnd === isEnd
        ? prev
        : { current, isBeginning, isEnd },
    );
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };
    measure();
    list.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(list);
    return () => {
      list.removeEventListener('scroll', schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure]);

  const scrollByItem = (direction: 1 | -1) => {
    const list = listRef.current;
    const first = list?.children[0] as HTMLElement | undefined;
    if (!list || !first) return;
    const second = list.children[1] as HTMLElement | undefined;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollBy({ left: direction * step, behavior: reduce ? 'auto' : 'smooth' });
    // Announce only on button-driven changes, after the scroll settles.
    window.setTimeout(() => {
      const el = listRef.current;
      if (!el) return;
      measure();
      setAnnouncement('');
      requestAnimationFrame(() => setAnnouncement('update'));
    }, 400);
  };

  return (
    <section className="w-full bg-mist section-y">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-3 w-full">
          <SectionHeading>{sectionTitle}</SectionHeading>

          <div className="ml-auto flex items-center gap-2">
            <p className="mr-2 shrink-0 whitespace-nowrap text-base text-black/70">
              <span aria-hidden="true">
                {position.current} / {total}
              </span>
              <span className="sr-only" aria-live="polite">
                {announcement ? t('position', { current: position.current, total }) : ''}
              </span>
            </p>
            <button
              type="button"
              aria-label={labels.previous}
              onClick={() => scrollByItem(-1)}
              disabled={position.isBeginning}
              className={controlClass}
            >
              <Icon id="icon-arrow" width={20} height={20} className="fill-current" />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => scrollByItem(1)}
              disabled={position.isEnd}
              className={controlClass}
            >
              <Icon id="icon-arrow" width={20} height={20} className="fill-current rotate-180" />
            </button>
          </div>
        </div>

        <ul
          ref={listRef}
          className="relative flex w-full gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <li key={project.title} className={itemClass}>
              <ProjectCard
                {...project}
                readLabel={labels.readCaseStudy}
                eager={index < EAGER_CARDS}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
