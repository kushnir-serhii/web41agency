"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

interface CircleProps {
  size?: number;
  top?: number | string;
  left?: number | string;
  startX?: number;
  startY?: number;
  speed?: number;
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
  className,
  title,
  description,
  children,
}) => {
  const { scrollY } = useScroll();

  const rawX = useTransform(scrollY, [0, speed], [startX, 0], { clamp: true });
  const rawY = useTransform(scrollY, [0, speed], [startY, 0], { clamp: true });

  const x = useSpring(rawX, { stiffness: 22, damping: 18, mass: 2.5 });
  const y = useSpring(rawY, { stiffness: 22, damping: 18, mass: 2.5 });

  return (
    <motion.div
      className={`absolute z-[1] bg-accent rounded-full flex flex-col justify-center items-center ${className ?? ""}`}
      style={{ top, left, width: size, height: size, x, y }}
    >
      <div className="flex flex-col justify-center items-center text-center">

      {title && <h4>{title}</h4>}
      {description && <p>{description}</p>}
      {children}
      </div>
    </motion.div>
  );
};
