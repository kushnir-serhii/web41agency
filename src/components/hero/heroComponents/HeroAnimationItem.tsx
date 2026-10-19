'use client';

import Image, { StaticImageData } from 'next/image';

interface HeroAnimationItemProps {
  arraySrc: (string | StaticImageData)[];
  speed: number;
  slideLabel: string;
  revers?: boolean;
  direction?: 'vertical' | 'horizontal';
}

const SIZES = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw';

export const HeroAnimationItem: React.FC<HeroAnimationItemProps> = ({
  arraySrc,
  speed,
  slideLabel,
  revers = false,
  direction = 'vertical',
}) => {
  const isVertical = direction === 'vertical';

  const animationClass = isVertical
    ? revers
      ? 'animate-marquee-vertical-reverse'
      : 'animate-marquee-vertical'
    : revers
      ? 'animate-marquee-horizontal-reverse'
      : 'animate-marquee-horizontal';

  // Spacing after the last item is padding inside each copy, not a gap between
  // copies: the track moves by -50%, so both halves must be exactly equal.
  const gapClass = 'gap-3 lg:gap-4';
  const trailClass = isVertical ? 'pb-3 lg:pb-4' : 'pr-3 lg:pr-4';
  const groupClass = `flex ${isVertical ? 'flex-col' : 'flex-row'} ${gapClass} ${trailClass} shrink-0`;

  return (
    <div className="relative flex-1 h-full overflow-hidden">
      <div
        className={`absolute flex w-full ${isVertical ? 'flex-col' : 'flex-row'} ${animationClass}`}
        style={
          {
            '--marquee-duration': `${speed}s`,
          } as React.CSSProperties
        }
      >
        {[false, true].map((isCopy) => (
          <div
            key={isCopy ? 'second' : 'first'}
            className={groupClass}
            aria-hidden={isCopy || undefined}
          >
            {arraySrc.map((src, index) => (
              <Image
                key={index}
                src={src}
                width={308}
                height={308}
                sizes={SIZES}
                alt={isCopy ? '' : `${slideLabel} ${index + 1}`}
                className="w-full aspect-square"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
