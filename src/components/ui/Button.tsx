import Link from 'next/link';

import { cn } from '@/utils/cn';

interface ButtonProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  btnType?: 'primary' | 'secondary' | 'ghost';
  /**
   * When set, the button renders as a link. Without it the component stays a
   * plain <button> — existing call sites are unaffected.
   */
  href?: string;
  type?: 'button' | 'submit';
}

const baseClass = `flex justify-center items-center shrink-0 gap-2.5 h-14 px-6 py-4 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg active:scale-98 active:shadow-sm
              text-lg font-bold whitespace-nowrap`;

export const Button: React.FC<ButtonProps> = ({
  text,
  btnType = 'primary',
  children,
  className,
  href,
  type = 'button',
}) => {
  const btnTypeStyle = {
    primary: 'bg-black text-white',
    secondary: 'bg-white text-black',
    ghost: 'text-black ',
  };

  const classes = cn(baseClass, btnTypeStyle[btnType], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        <span>{text}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
      <span>{text}</span>
    </button>
  );
};
