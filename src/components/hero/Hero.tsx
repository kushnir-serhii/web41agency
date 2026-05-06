import { Circle } from "@/components/circle/Circle";
import { Button } from "@/components/ui/Button";
import { HeroAnimation } from "./heroComponents/HeroAnimation";

export const Hero: React.FC = () => {
  return (
    <div className="relative flex flex-col">

      {/* Mobile circle */}
      <Circle
        size={259}
        top={0}
        left={0}
        startX={0}
        startY={150}
        speed={700}
        className="lg:hidden"
      />

      {/* Desktop circle */}
      <Circle
        size={300}
        top={0}
        left={176}
        startX={0}
        startY={150}
        speed={700}
        className="hidden lg:block"
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center lg:justify-between px-4 lg:px-20 pt-[160px] pb-0 lg:pt-25 gap-10 lg:gap-0 overflow-hidden">
        <h1 className="w-full lg:max-w-[760px] text-[60px] lg:text-[88px] font-bold leading-tight text-left">
          <span className="text-[#656973]/12">Custom</span>
          <span className="text-black"> Websites &amp; Web Apps – </span>
          <span className="text-[#656973]/12">Built to Perform</span>
        </h1>

        <div className="flex flex-col items-start w-full lg:max-w-[410px] gap-6 lg:gap-0 lg:justify-between lg:h-[238px]">
          <p className="w-full opacity-80 text-lg text-left text-black">
            From sleek Webflow sites to full-stack JS solutions, we design,
            develop, and launch websites that grow.
          </p>
          <div className="flex justify-start items-center gap-2 lg:gap-0 self-stretch">
            <Button text="Free Consultation" fill />
            <Button text="View Projects" />
          </div>
        </div>
      </div>

      <div className="relative z-[2]">
        <HeroAnimation />
      </div>
    </div>
  );
};
