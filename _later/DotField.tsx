'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/utils/cn';

const SPACING = 26; // px between dots
const BASE_RADIUS = 1.1; // resting dot radius
const REACH = 150; // how far (px) the pointer's influence extends
const PUSH = 16; // max px a dot is pushed away from the pointer
const EASE = 0.14; // share of the remaining distance a dot covers each frame

interface Dot {
  x: number;
  y: number;
  /* Current offset from the grid point and "heat" (0 at rest, 1 under the pointer). */
  ox: number;
  oy: number;
  heat: number;
}

/* A quiet grid of dots that parts and darkens around the mouse. The loop only
   runs while dots are moving, so an idle hero costs nothing. Touch devices and
   reduced-motion users get the static grid. */
export const DotField = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const interactive =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Resting dots share one path; only the disturbed ones are drawn one by one.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.13)';
      ctx.beginPath();
      for (const d of dots) {
        if (d.heat > 0.01) continue;
        ctx.moveTo(d.x + d.ox + BASE_RADIUS, d.y + d.oy);
        ctx.arc(d.x + d.ox, d.y + d.oy, BASE_RADIUS, 0, Math.PI * 2);
      }
      ctx.fill();

      for (const d of dots) {
        if (d.heat <= 0.01) continue;
        ctx.fillStyle = `rgba(0, 0, 0, ${0.13 + d.heat * 0.6})`;
        ctx.beginPath();
        ctx.arc(d.x + d.ox, d.y + d.oy, BASE_RADIUS + d.heat * 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(1, Math.ceil(width / SPACING));
      const rows = Math.max(1, Math.ceil(height / SPACING));
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: offsetX + c * SPACING, y: offsetY + r * SPACING, ox: 0, oy: 0, heat: 0 });
        }
      }
      draw();
      canvas.style.opacity = '1';
    };

    const step = () => {
      let moving = false;
      for (const d of dots) {
        let tx = 0;
        let ty = 0;
        let th = 0;
        if (pointer) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REACH) {
            const falloff = 1 - dist / REACH;
            const force = falloff * falloff * PUSH;
            const n = dist || 1;
            tx = (dx / n) * force;
            ty = (dy / n) * force;
            th = falloff;
          }
        }
        d.ox += (tx - d.ox) * EASE;
        d.oy += (ty - d.oy) * EASE;
        d.heat += (th - d.heat) * EASE;
        if (Math.abs(tx - d.ox) > 0.05 || Math.abs(ty - d.oy) > 0.05 || Math.abs(th - d.heat) > 0.005) {
          moving = true;
        }
      }
      draw();
      frame = moving && visible ? requestAnimationFrame(step) : 0;
    };

    const kick = () => {
      if (!frame && visible) frame = requestAnimationFrame(step);
    };

    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    });
    resizeObserver.observe(canvas);
    build();

    if (!interactive) {
      return () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(resizeFrame);
      };
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const near = x > -REACH && y > -REACH && x < width + REACH && y < height + REACH;
      if (!near && !pointer) return;
      pointer = near ? { x, y } : null;
      kick();
    };
    const onLeave = () => {
      pointer = null;
      kick();
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibilityObserver.observe(canvas);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(resizeFrame);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-700',
        className,
      )}
    />
  );
};
