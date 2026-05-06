import {
  heroImagesArray_1,
  heroImagesArray_2,
  heroImagesArray_3,
  heroImagesArray_4,
} from "@/content/heroImagesArray";
import { HeroAnimationItem } from "./HeroAnimationItem";

export const HeroAnimation: React.FC = () => {
  return (
    <div className="bg-bg_hero w-full">
      <div className="relative flex w-full gap-4 h-[500px]">
        <HeroAnimationItem arraySrc={heroImagesArray_1} speed={85} />
        <HeroAnimationItem arraySrc={heroImagesArray_2} speed={80} revers={true} />
        <HeroAnimationItem arraySrc={heroImagesArray_3} speed={95} className="hidden lg:flex" />
        <HeroAnimationItem arraySrc={heroImagesArray_4} speed={90} revers={true} className="hidden lg:flex" />
      </div>
    </div>
  );
};
