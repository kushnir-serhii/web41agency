'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';

interface MagneticProps {
  /* Max distance (px) the element drifts toward the pointer. */
  strength?: number;
  /* How far (px) beyond the element's edge the pull starts. */
  reach?: number;
  className?: string;
  children: React.ReactNode;
}

/* Pulls its content toward the pointer while the pointer is nearby, then
   springs back. Off for touch / coarse pointers and reduced motion. */
export const Magnetic = ({ strength = 24, reach = 48, className, children }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 160, damping: 14, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 160, damping: 14, mass: 0.6 });

  useEffect(() => {
    if (prefersReduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      // Measure the untranslated box so the pull doesn't feed back on itself.
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - x.get();
      const cy = rect.top + rect.height / 2 - y.get();
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const zone = rect.width / 2 + reach;

      if (Math.hypot(dx, dy) < zone) {
        rawX.set((dx / zone) * strength);
        rawY.set((dy / zone) * strength);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };
    const reset = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', reset);
    };
  }, [prefersReduced, strength, reach, rawX, rawY, x, y]);

  return (
    <motion.div ref={ref} className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
};
