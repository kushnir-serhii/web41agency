import { getTranslations } from 'next-intl/server';

import { legalDocuments } from '@/content/legal';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/types';

interface LegalSwitcherProps {
  currentSlug: string;
  locale: Locale;
}

export const LegalSwitcher: React.FC<LegalSwitcherProps> = async ({ currentSlug, locale }) => {
  const t = await getTranslations('Legal');

  return (
    <nav aria-label={t('switcherLabel')} className="print:hidden">
      {/* Wraps: the two uk titles are wider than a phone screen side by side. */}
      <ul className="flex flex-wrap gap-2">
        {legalDocuments[locale].map(({ slug, title }) => {
          const isActive = slug === currentSlug;
          return (
            <li key={slug}>
              <Link
                href={`/${slug}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex justify-center items-center min-h-11 px-4 rounded-[100px] text-base lg:text-lg leading-[18px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  isActive
                    ? 'bg-black text-white'
                    : 'border border-black/10 text-black hover:border-black/40'
                }`}
              >
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
