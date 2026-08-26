'use client';

import Image, { StaticImageData } from 'next/image';

interface HeroAnimationItemProps {
  arraySrc: (string | StaticImageData)[];
  speed: number;
  revers?: boolean;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const HeroAnimationItem: React.FC<HeroAnimationItemProps> = ({
  arraySrc,
  speed,
  revers = false,
  direction = 'vertical',
  className,
}) => {
  const isVertical = direction === 'vertical';

  const animationClass = isVertical
    ? revers
      ? 'animate-marquee-vertical-reverse'
      : 'animate-marquee-vertical'
    : revers
      ? 'animate-marquee-horizontal-reverse'
      : 'animate-marquee-horizontal';

  const groupClass = isVertical ? 'flex flex-col gap-4 shrink-0' : 'flex flex-row gap-4 shrink-0';

  return (
    <div className={`relative flex-1 h-full overflow-hidden ${className ?? ''}`}>
      <div
        className={`absolute flex gap-4 w-full  ${
          isVertical ? 'flex-col' : 'flex-row'
        } ${animationClass}`}
        style={
          {
            '--marquee-duration': `${speed}s`,
          } as React.CSSProperties
        }
      >
        {/* First copy */}
        <div className={groupClass}>
          {arraySrc.map((src, index) => (
            <Image
              key={`first-${index}`}
              src={src}
              width={308}
              height={308}
              alt={`Slide ${index + 1}`}
              className="w-full aspect-square"
            />
          ))}
        </div>

        {/* Second copy */}
        <div className={groupClass}>
          {arraySrc.map((src, index) => (
            <Image
              key={`second-${index}`}
              src={src}
              width={308}
              height={308}
              alt={`Slide ${index + 1}`}
              className="w-full aspect-square"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// "use client";

// import { motion } from "motion/react";
// import Image from "next/image";
// import { useMemo, useRef } from "react";

// interface HeroAnimationItemProps {
//   arraySrc: string[];
//   speed: number;
//   revers?: boolean;
//   className?: string;
// }

// export const HeroAnimationItem: React.FC<HeroAnimationItemProps> = ({
//   arraySrc,
//   speed,
//   revers,
//   className,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const slides = useMemo(() => [...arraySrc, ...arraySrc], [arraySrc]);

//   return (
//     <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${className ?? ""}`}>
//       <motion.div
//         ref={containerRef}
//         className="absolute -top-20 flex flex-col gap-4"
//         animate={revers ? { y: ["-50%", "0%"] } : { y: ["0%", "-50%"] }} // Moves up infinitely
//         transition={{
//           repeat: Infinity,
//           repeatType: "loop",
//           ease: "linear",
//           duration: speed, // Adjust speed
//         }}
//       >
//         {slides.map((src, index) => (
//           <Image
//             key={index}
//             src={src}
//             width={308}
//             height={308}
//             alt={`Slide ${index + 1}`}

//           />
//         ))}
//       </motion.div>
//     </div>
//   );
// };
