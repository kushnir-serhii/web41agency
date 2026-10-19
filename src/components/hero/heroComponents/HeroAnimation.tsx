import {
  heroImagesArray_1,
  heroImagesArray_2,
  heroImagesArray_3,
  heroImagesArray_4,
} from '@/content/heroImagesArray';

import { HeroAnimationItem } from './HeroAnimationItem';

// Columns: 2 on mobile, 3 from md, 4 from lg.
const columns = [
  { images: heroImagesArray_1, speed: 85, reverse: false, visibility: '' },
  { images: heroImagesArray_2, speed: 80, reverse: true, visibility: '' },
  { images: heroImagesArray_3, speed: 95, reverse: false, visibility: 'hidden md:block' },
  { images: heroImagesArray_4, speed: 90, reverse: true, visibility: 'hidden lg:block' },
];

export const HeroAnimation: React.FC = () => {
  // Decorative project montage: hidden from assistive tech, the hero copy carries the meaning.
  return (
    <div aria-hidden="true" className="bg-bg_hero w-full">
      <ul className="relative flex items-center justify-between gap-3 lg:gap-4 w-full max-w-[1440px] mx-auto h-[220px] md:h-[440px] lg:h-[500px] px-4 lg:px-20">
        {columns.map(({ images, speed, reverse, visibility }, index) => (
          <li key={index} className={`flex-1 min-w-0 h-full ${visibility}`}>
            <HeroAnimationItem arraySrc={images} speed={speed} revers={reverse} />
          </li>
        ))}
      </ul>
    </div>
  );
};
