'use client';

import { useState } from 'react';

import { cn } from '@/utils/cn';

import { MarqueeToggle } from './MarqueeToggle';

interface MarqueeRegionProps {
  children: React.ReactNode;
  pauseLabel: string;
  playLabel: string;
  className?: string;
  toggleClassName?: string;
}

/* Wraps a marquee (server-rendered children) with a pause/play toggle. Tracks
   inside use `marqueePausedClass` to react to the toggle, hover and focus. */
export const MarqueeRegion: React.FC<MarqueeRegionProps> = ({
  children,
  pauseLabel,
  playLabel,
  className,
  toggleClassName,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={cn('group/marquee relative', className)} data-paused={isPaused}>
      {children}
      <MarqueeToggle
        isPaused={isPaused}
        onToggle={() => setIsPaused((prev) => !prev)}
        pauseLabel={pauseLabel}
        playLabel={playLabel}
        className={cn('absolute z-20 right-4 bottom-4 lg:right-20', toggleClassName)}
      />
    </div>
  );
};
