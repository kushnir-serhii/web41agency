"use client";

import { MySlider } from "../slider/Slider";
import { techStackIconsArray } from "@/content/techStackIconsArray";
import { Icon } from "../ui/Icon";

export const TechStack = () => {
  return (
    <section className="flex flex-col justify-between gap-10 lg:gap-20 py-20 lg:py-40 w-full max-w-[1440px]">
      <h2 className="container mr-auto text-4xl lg:text-6xl font-semibold text-left text-black">
        Tech Stack
      </h2>
      <div className="relative w-full">
        <div className="absolute flex z-10 top-0 h-full gradient-techstack_slider w-full" />
        <MySlider
          contentArray={techStackIconsArray}
          className="w-auto marquee"
          config={{
            slidesPerView: 10,
            spaceBetween: 16,
            loop: true,
            freeMode: true,
            autoplay: {
              delay: 0,
            },
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
            <Icon id={item} height={60} className="w-full max-w-[130px]" />
          )}
        />
      </div>
      {/* <ul className="flex  justify-between items-center gap-12 w-full">
        {techStackIconsArray.slice(0, 4).map((item, index) => (
          <li key={index.toString() + item} className="w-full max-w-1/4">
            <Icon id={item} className="w-full" />
          </li>
        ))}
      </ul> */}
    </section>
  );
};
