'use client';

import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { useEffect, useState } from 'react';

interface CircleProps {
  size?: number;
  top?: number | string;
  left?: number | string;
  startX?: number;
  startY?: number;
  speed?: number;
  /* Entrance: the circle rises this many px from below on mount. 0 disables it. */
  riseFrom?: number;
  className?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Circle: React.FC<CircleProps> = ({
  size = 259,
  top = 0,
  left = 0,
  startX = 0,
  startY = 150,
  speed = 700,
  riseFrom = 0,
  className,
  title,
  description,
  children,
}) => {
  // useReducedMotion is null on the server, so gate it behind mount: the first
  // client render must match the SSR markup or hydration fails.
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduceMotion = mounted && prefersReduced;

  const { scrollY } = useScroll();

  const rawX = useTransform(scrollY, [0, speed], [startX, 0], { clamp: true });
  const rawY = useTransform(scrollY, [0, speed], [startY, 0], { clamp: true });

  const x = useSpring(rawX, { stiffness: 22, damping: 18, mass: 2.5 });
  const y = useSpring(rawY, { stiffness: 22, damping: 18, mass: 2.5 });
  // Reduced motion: hold the scroll-0 resting position instead of drifting.
  const stillX = useMotionValue(startX);
  const stillY = useMotionValue(startY);

  return (
    // reducedMotion="user" makes the rise instant for those who ask for less motion.
    <MotionConfig reducedMotion="user">
      <motion.div
        className={`absolute z-[1] ${className ?? ''}`}
        style={{ top, left, width: size, height: size }}
        initial={riseFrom !== 0 ? { y: riseFrom, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="size-full bg-accent rounded-full flex flex-col justify-center items-center"
          style={reduceMotion ? { x: stillX, y: stillY } : { x, y }}
        >
          <div className="flex flex-col justify-center items-center text-center">
            {title && <h4>{title}</h4>}
            {description && <p>{description}</p>}
            {children}
          </div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};
