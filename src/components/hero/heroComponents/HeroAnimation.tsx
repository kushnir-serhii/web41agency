import { getTranslations } from 'next-intl/server';

import {
  heroImagesArray_1,
  heroImagesArray_2,
  heroImagesArray_3,
  heroImagesArray_4,
} from '@/content/heroImagesArray';

import { MarqueeRegion } from '../../slider/MarqueeRegion';
import { HeroAnimationItem } from './HeroAnimationItem';

// Columns: 2 on mobile, 3 from md, 4 from lg. Only columns visible at every width load
// images eagerly; hidden columns stay lazy so display:none ones never download on mobile.
const columns = [
  { images: heroImagesArray_1, speed: 85, reverse: false, visibility: '', eagerCount: 2 },
  { images: heroImagesArray_2, speed: 80, reverse: true, visibility: '', eagerCount: 2 },
  {
    images: heroImagesArray_3,
    speed: 95,
    reverse: false,
    visibility: 'hidden md:block',
    eagerCount: 0,
  },
  {
    images: heroImagesArray_4,
    speed: 90,
    reverse: true,
    visibility: 'hidden lg:block',
    eagerCount: 0,
  },
];

export const HeroAnimation = async () => {
  const t = await getTranslations('Marquee');
  // Decorative project montage: hidden from assistive tech, the hero copy carries the meaning.
  return (
    <MarqueeRegion
      className="bg-bg_hero w-full"
      pauseLabel={t('pause')}
      playLabel={t('play')}
      toggleClassName="max-w-none lg:right-[max(1.25rem,calc((100%-1440px)/2+5rem))]"
    >
      <div aria-hidden="true">
        <ul className="relative flex items-center justify-between gap-3 lg:gap-4 w-full max-w-[1440px] mx-auto h-[220px] md:h-[440px] lg:h-[500px] px-4 lg:px-20">
          {columns.map(({ images, speed, reverse, visibility, eagerCount }, index) => (
            <li key={index} className={`flex-1 min-w-0 h-full ${visibility}`}>
              <HeroAnimationItem
                arraySrc={images}
                speed={speed}
                revers={reverse}
                eagerCount={eagerCount}
              />
            </li>
          ))}
        </ul>
      </div>
    </MarqueeRegion>
  );
};
