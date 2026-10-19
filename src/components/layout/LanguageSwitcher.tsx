'use client';

import { useLocale, useTranslations } from 'next-intl';

import { LanguageSwitcherOption } from '@/components/layout/LanguageSwitcherOption';
import { LOCALE_OPTIONS } from '@/consts/locales';
import { cn } from '@/utils/cn';

interface ILanguageSwitcherProps {
  variant: 'pill' | 'full';
  className?: string;
}

export const LanguageSwitcher: React.FC<ILanguageSwitcherProps> = ({ variant, className }) => {
  const t = useTranslations('LanguageSwitcher');
  const currentLocale = useLocale();

  return (
    <div
      role="group"
      aria-label={t('groupLabel')}
      className={cn(
        'gap-1 rounded-[100px] bg-bg_header/30 p-1',
        variant === 'pill' ? 'inline-flex' : 'flex w-full',
        className,
      )}
    >
      {LOCALE_OPTIONS.map((option) => (
        <LanguageSwitcherOption
          key={option.locale}
          option={option}
          isActive={option.locale === currentLocale}
          variant={variant}
        />
      ))}
    </div>
  );
};
