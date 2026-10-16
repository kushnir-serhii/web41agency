import { Link } from '@/i18n/navigation';
import { cn } from '@/utils/cn';

interface ButtonProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  btnType?: 'primary' | 'secondary' | 'ghost' | 'accent';
  /**
   * When set, the button renders as a link. Without it the component stays a
   * plain <button> — existing call sites are unaffected.
   */
  href?: string;
  type?: 'button' | 'submit';
  size?: 'md' | 'sm';
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Only applies to the plain <button> variant. */
  disabled?: boolean;
}

const sizeClass = {
  md: 'h-14 px-6 text-lg',
  sm: 'h-11 px-5 py-2 text-base',
};

const baseClass = `flex justify-center items-center shrink-0 gap-2.5 py-4 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg active:scale-98 active:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100
              font-bold whitespace-nowrap`;

export const Button: React.FC<ButtonProps> = ({
  text,
  btnType = 'primary',
  children,
  className,
  href,
  type = 'button',
  size = 'md',
  onClick,
  disabled,
}) => {
  const btnTypeStyle = {
    primary: 'bg-black text-white',
    secondary: 'bg-white text-black',
    ghost: 'text-black ',
    accent: 'bg-accent text-black',
  };

  const classes = cn(baseClass, sizeClass[size], btnTypeStyle[btnType], className);

  if (href && /^(mailto:|tel:|http)/.test(href)) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
        <span>{text}</span>
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
        <span>{text}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cn(classes, disabled && 'opacity-60 cursor-not-allowed')}
      onClick={onClick}
      disabled={disabled}
      aria-busy={disabled || undefined}
    >
      {children}
      <span>{text}</span>
    </button>
  );
};
