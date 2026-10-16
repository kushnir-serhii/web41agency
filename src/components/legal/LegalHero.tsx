import { getTranslations } from 'next-intl/server';

import type { LegalDocument } from '@/content/legal/types';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/types';

import { LegalSwitcher } from './LegalSwitcher';

interface LegalHeroProps {
  doc: LegalDocument;
  formattedDate: string;
  minutes: number;
  locale: Locale;
}

export const LegalHero: React.FC<LegalHeroProps> = async ({
  doc,
  formattedDate,
  minutes,
  locale,
}) => {
  const t = await getTranslations('Legal');
  const chipClass =
    'flex justify-center items-center px-4 py-2 rounded-[100px] border border-black/10 text-base lg:text-lg leading-[18px] text-black';

  const meta = [
    {
      key: 'date',
      content: (
        <span>
          {t('lastUpdated')} <time dateTime={doc.lastUpdated}>{formattedDate}</time>
        </span>
      ),
    },
    { key: 'reading', content: t('minRead', { minutes }) },
  ];

  return (
    <section className="flex flex-col items-start gap-8 pt-[140px] lg:pt-[120px] pb-10 lg:pb-14">
      <nav aria-label={t('breadcrumbLabel')} className="text-lg text-black/60">
        <Link
          href="/"
          className="hover:text-black focus-visible:text-black underline-offset-4 hover:underline"
        >
          {t('home')}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span>{t('legal')}</span>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-black" aria-current="page">
          {doc.title}
        </span>
      </nav>

      <div className="flex flex-col items-start gap-6 w-full lg:max-w-[760px]">
        <h1 className="text-[44px] lg:text-[72px] font-bold leading-tight text-left text-black break-words">
          {doc.title}
        </h1>
        <p className="text-lg lg:text-xl leading-relaxed text-black/60">{doc.description}</p>
        {doc.prevailingNote && (
          <p
            role="note"
            className="rounded-lg bg-bg_item px-4 py-3 text-base lg:text-lg leading-relaxed text-black"
          >
            {doc.prevailingNote}
          </p>
        )}
        <ul className="flex flex-wrap items-start gap-2">
          {meta.map(({ key, content }) => (
            <li key={key} className={chipClass}>
              {content}
            </li>
          ))}
        </ul>
        <LegalSwitcher currentSlug={doc.slug} locale={locale} />
      </div>
    </section>
  );
};
