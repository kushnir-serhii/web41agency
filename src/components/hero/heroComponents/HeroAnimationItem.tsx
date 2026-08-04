"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface HeroAnimationItemProps {
  arraySrc: string[];
  speed: number;
  revers?: boolean;
  className?: string;
}

export const HeroAnimationItem: React.FC<HeroAnimationItemProps> = ({
  arraySrc,
  speed,
  revers,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState([...arraySrc, ...arraySrc]);

  useEffect(() => {
    setSlides((prev) => [...prev, ...prev]);
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${className ?? ""}`}>
      <motion.div
        ref={containerRef}
        className="absolute -top-20 flex flex-col gap-4"
        animate={revers ? { y: ["-50%", "0%"] } : { y: ["0%", "-50%"] }} // Moves up infinitely
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed, // Adjust speed
        }}
      >
        {slides.map((src, index) => (
          <Image
            key={index}
            src={src}
            width={308}
            height={308}
            alt={`Slide ${index + 1}`}
            // className="h-auto"
          />
        ))}
      </motion.div>
    </div>
  );
};
