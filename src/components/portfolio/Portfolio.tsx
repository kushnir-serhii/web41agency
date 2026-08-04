"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperCore } from "swiper/types";
import "swiper/css";
import { Icon } from "@/components/ui/Icon";
import { ProjectCard } from "./portfolioComponents/ProjectCard";
import { IProject } from "@/content/portfolioContent";

interface PortfolioProps {
  content: {
    sectionTitle: string;
    projects: IProject[];
  };
}

export const Portfolio: React.FC<PortfolioProps> = ({ content }) => {
  const { sectionTitle, projects } = content;
  const swiperRef = useRef<SwiperCore | null>(null);

  return (
    <section className="w-full bg-bg_item py-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 flex flex-col gap-6">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-4xl lg:text-[60px] font-bold leading-none text-left text-black">
            {sectionTitle}
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex items-center p-2.5 rounded-full bg-white/75 cursor-pointer transition-colors hover:bg-white"
            >
              <Icon id="icon-arrow" width={20} height={20} />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex items-center p-2.5 rounded-full bg-white/75 cursor-pointer transition-colors hover:bg-white"
            >
              <Icon id="icon-arrow" width={20} height={20} className="rotate-180" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
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
            <SwiperSlide key={project.image} className="h-auto">
              <ProjectCard {...project} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
