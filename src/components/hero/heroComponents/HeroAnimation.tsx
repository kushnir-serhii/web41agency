import {
  heroImagesArray_1,
  heroImagesArray_2,
  heroImagesArray_3,
  heroImagesArray_4,
} from '@/content/heroImagesArray';
import { HeroAnimationItem } from './HeroAnimationItem';

export const HeroAnimation: React.FC = () => {
  return (
    <div className="bg-bg_hero w-full">
      <ul className="relative flex items-center justify-between gap-4 w-full h-[500px] px-20">
        <li className="flex-1 h-full">
          <HeroAnimationItem arraySrc={heroImagesArray_1} speed={85} />
        </li>
        <li className="flex-1 h-full">
          <HeroAnimationItem arraySrc={heroImagesArray_2} speed={80} revers={true} />
        </li>
        <li className="flex-1 h-full">
          <HeroAnimationItem arraySrc={heroImagesArray_3} speed={95} className="hidden lg:flex" />
        </li>
        <li className="flex-1 h-full">
          <HeroAnimationItem
            arraySrc={heroImagesArray_4}
            speed={90}
            revers={true}
            className="hidden lg:flex"
          />
        </li>
      </ul>
    </div>
  );
};
