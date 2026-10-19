import React from 'react';

import { cn } from '@/utils/cn';

interface MySliderProps<T> {
  contentArray: T[];
  slide: (item: T, index: number) => React.ReactNode;
  /* Seconds each item takes to scroll past; total loop = items × this. */
  secondsPerItem?: number;
  itemClassName?: string;
  className?: string;
}

/* Endless horizontal marquee on the same CSS keyframes as the hero
   (`animate-marquee-horizontal` in globals.css): no JS, stopped for
   prefers-reduced-motion by the global rule. The list renders twice and
   the track moves by -50%, so the second copy lands exactly where the
   first started. Spacing is padding inside each copy (not a gap between
   copies), which keeps the two halves equal and the loop seamless. */
export const MySlider = <T,>({
  contentArray,
  slide,
  secondsPerItem = 6.8,
  itemClassName,
  className,
}: MySliderProps<T>) => (
  <div className={cn('relative w-full overflow-hidden', className)}>
    <div
      className="flex w-max animate-marquee-horizontal"
      style={
        {
          '--marquee-duration': `${contentArray.length * secondsPerItem}s`,
        } as React.CSSProperties
      }
    >
      {[false, true].map((isCopy) => (
        <ul
          key={isCopy ? 'second' : 'first'}
          className="flex shrink-0 items-center gap-4 pr-4"
          aria-hidden={isCopy || undefined}
        >
          {contentArray.map((item, index) => (
            <li
              key={index}
              className={cn('flex shrink-0 items-center justify-center', itemClassName)}
            >
              {slide(item, index)}
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);
