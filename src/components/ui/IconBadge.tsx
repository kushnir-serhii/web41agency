import { cn } from '@/utils/cn';

interface IconBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const sizeClass = {
  sm: 'size-10 md:size-12',
  md: 'size-16 lg:size-20',
  lg: 'size-20',
};

export const IconBadge: React.FC<IconBadgeProps> = ({ size = 'md', children, className }) => (
  <span
    aria-hidden="true"
    className={cn(
      'flex shrink-0 items-center justify-center rounded-full bg-white text-black ring-1 ring-inset ring-black/15',
      sizeClass[size],
      className,
    )}
  >
    {children}
  </span>
);
