'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Icon } from '@/components/ui/Icon';
import { CONSULTATION_HREF } from '@/content/ctaLinks';
import type { IService } from '@/content/servicesContent';
import { cn } from '@/utils/cn';

interface ServiceItemProps extends IService {
  isOpen: boolean;
  onToggle: () => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  description,
  timeline,
  isOpen,
  onToggle,
}) => {
  const t = useTranslations('Services');
  const bodyId = useId();

  return (
    <li
      className={cn(
        'group relative w-full overflow-hidden border-b border-black/10 first:border-t transition-colors hover:bg-bg_item',
        isOpen && 'bg-bg_item',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        className="relative flex items-center justify-between w-full gap-4 px-4 lg:px-20 py-6 lg:h-[120px] text-left cursor-pointer focus-visible:-outline-offset-4"
      >
        <span
          aria-hidden
          className={cn(
            'pointer-events-none hidden lg:block absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[76px] rounded-full bg-accent transition-opacity duration-300 lg:group-hover:opacity-100',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
        />
        <span className="relative text-xl lg:text-[32px] text-black">{title}</span>
        <span className="relative flex items-center gap-3 lg:gap-4 shrink-0">
          <Icon
            id="icon-add"
            width={24}
            height={24}
            className={cn('shrink-0 duration-300', isOpen ? 'rotate-45' : 'rotate-0')}
          />
        </span>
      </button>

      <div
        id={bodyId}
        inert={!isOpen}
        className={cn(
          'relative grid transition-[grid-template-rows] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 px-4 lg:px-20 pb-6 lg:pb-10 lg:max-w-[760px] text-left">
            <p className="opacity-80 text-base lg:text-lg text-black">{description}</p>
            <p className="text-base text-black/70">{t('timeline', { value: timeline })}</p>
            <a
              href={CONSULTATION_HREF}
              className="inline-flex min-h-11 items-center gap-1 self-start text-base font-medium text-black underline underline-offset-4 hover:no-underline"
            >
              {t('getQuote')}
              <span aria-hidden>
                <Icon id="icon-arrow_outward" width={14} height={14} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};
