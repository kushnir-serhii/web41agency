import { getTranslations } from 'next-intl/server';

import { Circle } from '@/components/circle/Circle';
import { Button } from '@/components/ui/Button';
import { CONSULTATION_HREF, PROJECTS_HREF } from '@/content/ctaLinks';

export interface IHeadingPart {
  text: string;
  /* Muted parts are the faded grey words in the design; the rest stay black. */
  muted?: boolean;
}

interface PageHeroProps {
  heading: IHeadingPart[];
  description: string;
  primaryButton?: string;
  secondaryButton?: string;
  primaryHref?: string;
  secondaryHref?: string;
  hideSecondary?: boolean;
  /* Rendered below the hero copy — the home page puts its image animation here. */
  children?: React.ReactNode;
}

export const PageHero = async ({
  heading,
  description,
  primaryButton,
  secondaryButton,
  primaryHref = CONSULTATION_HREF,
  secondaryHref = PROJECTS_HREF,
  hideSecondary = false,
  children,
}: PageHeroProps) => {
  const t = await getTranslations('Cta');

  return (
    <div className="relative flex flex-col w-full">
      {/* Both circles rise in from below on load, then keep drifting up as the page scrolls.
          `top` is the scrolled-out end point; at scroll 0 each sits `startY` px lower. */}

      {/* Mobile circle: rests in the top padding, clear of the header's lime menu button. */}
      <Circle
        size={150}
        top={-50}
        left="calc(100% - 170px)"
        startX={40}
        startY={60}
        speed={700}
        riseFrom={80}
        className="lg:hidden"
      />

      {/* Desktop circle: rests top-left, behind the first heading word. */}
      <Circle
        size={320}
        top={-112}
        left="max(0px, calc(50% - 708px))"
        startX={0}
        startY={160}
        speed={700}
        riseFrom={140}
        className="hidden lg:block"
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center lg:justify-between px-4 lg:px-20 pt-[120px] lg:pt-25 pb-8 lg:pb-14 gap-6 lg:gap-12 overflow-hidden">
        <h1 className="w-full min-w-0 lg:max-w-[760px] text-[clamp(2.25rem,10.5vw,3.75rem)] md:text-[60px] lg:text-[clamp(4rem,6.5vw,5.5rem)] font-bold leading-[1.08] lg:leading-tight text-left">
          {heading.map(({ text, muted }, index) => (
            <span key={index} className={muted ? 'text-muted_text' : 'text-black'}>
              {index > 0 ? ' ' : ''}
              {text}
            </span>
          ))}
        </h1>

        <div className="flex flex-col items-start w-full lg:max-w-[410px] gap-6">
          <p className="w-full opacity-80 text-lg text-left text-black">{description}</p>
          {/* Wraps instead of clipping when longer (uk) labels outgrow the 410px aside. */}
          <div className="flex flex-col md:flex-row md:flex-wrap justify-start items-center gap-2 self-stretch">
            <Button
              text={primaryButton ?? t('freeQuote')}
              href={primaryHref}
              className="w-full md:w-auto"
            />
            {!hideSecondary && (
              <Button
                text={secondaryButton ?? t('viewProjects')}
                href={secondaryHref}
                btnType="ghost"
                className="w-full md:w-auto"
              />
            )}
          </div>
        </div>
      </div>

      {children && <div className="relative z-[2]">{children}</div>}
    </div>
  );
};
