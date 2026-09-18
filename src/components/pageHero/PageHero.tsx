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

export const PageHero: React.FC<PageHeroProps> = ({
  heading,
  description,
  primaryButton = 'Free Consultation',
  secondaryButton = 'View Projects',
  primaryHref = CONSULTATION_HREF,
  secondaryHref = PROJECTS_HREF,
  hideSecondary = false,
  children,
}) => {
  return (
    <div className="relative flex flex-col w-full">
      {/* Mobile circle: stays inside the 160px top padding, above the heading. */}
      <Circle
        size={150}
        top={0}
        left="calc(100% - 170px)"
        startX={40}
        startY={0}
        speed={700}
        className="lg:hidden"
      />

      {/* Desktop circle: sits behind the description column, right of the heading. */}
      <Circle
        size={300}
        top={0}
        left="calc(50% + 230px)"
        startX={0}
        startY={150}
        speed={700}
        className="hidden lg:block"
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center lg:justify-between px-4 lg:px-20 pt-[160px] pb-0 lg:pt-25 gap-10 lg:gap-0 overflow-hidden">
        <h1 className="w-full lg:max-w-[760px] text-[60px] lg:text-[88px] font-bold leading-tight text-left">
          {heading.map(({ text, muted }, index) => (
            <span key={index} className={muted ? 'text-muted_text' : 'text-black'}>
              {index > 0 ? ' ' : ''}
              {text}
            </span>
          ))}
        </h1>

        <div className="flex flex-col items-start w-full lg:max-w-[410px] gap-6 lg:gap-0 lg:justify-between lg:h-[238px]">
          <p className="w-full opacity-80 text-lg text-left text-black">{description}</p>
          <div className="flex flex-col md:flex-row justify-start items-center gap-2 pb-4 self-stretch">
            <Button text={primaryButton} href={primaryHref} className="w-full md:w-auto" />
            {!hideSecondary && (
              <Button
                text={secondaryButton}
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
