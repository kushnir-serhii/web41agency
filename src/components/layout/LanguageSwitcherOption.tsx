'use client';

import type { ILocaleOption } from '@/consts/locales';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/utils/cn';

interface ILanguageSwitcherOptionProps {
  option: ILocaleOption;
  isActive: boolean;
  variant: 'pill' | 'full';
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const LanguageSwitcherOption: React.FC<ILanguageSwitcherOptionProps> = ({
  option,
  isActive,
  variant,
}) => {
  const pathname = usePathname();
  const { locale, short, endonym } = option;
  const label = variant === 'pill' ? short : endonym;

  const baseClasses = cn(
    'flex items-center justify-center rounded-[100px] text-base font-semibold',
    variant === 'pill' ? 'min-h-9 min-w-9 px-3' : 'min-h-11 flex-1 px-4',
  );

  if (isActive) {
    return (
      <span
        lang={locale}
        aria-current="true"
        aria-label={endonym}
        className={cn(baseClasses, 'bg-accent text-black')}
      >
        {label}
      </span>
    );
  }

  // Written before navigating (also for `en`) so the proxy does not redirect `/uk -> /` back.
  const handleClick = (): void => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
  };

  return (
    <Link
      href={pathname}
      locale={locale}
      lang={locale}
      hrefLang={locale}
      aria-label={endonym}
      scroll
      onClick={handleClick}
      className={cn(
        baseClasses,
        'text-black/60 transition-colors hover:text-black focus-visible:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
      )}
    >
      {label}
    </Link>
  );
};
