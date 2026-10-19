import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  /* h1 when the section opens its page (About Us); h2 everywhere else. */
  as?: 'h1' | 'h2';
  children: React.ReactNode;
  className?: string;
}

/* The one Headline style (DESIGN.md): 600, 36px mobile / 60px desktop. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  as: Heading = 'h2',
  children,
  className,
}) => (
  <Heading
    className={cn('w-full text-4xl lg:text-6xl font-semibold text-left text-black', className)}
  >
    {children}
  </Heading>
);
