import { getTranslations } from 'next-intl/server';

import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { buildLegalJsonLd } from '@/content/legal/metadata';
import type { LegalDocument } from '@/content/legal/types';
import { formatLegalDate, getReadingMinutes, getTocItems } from '@/content/legal/utils';
import type { Locale } from '@/i18n/types';

import { LegalContactCard } from './LegalContactCard';
import { LegalHero } from './LegalHero';
import { LegalSection } from './LegalSection';
import { LegalSummary } from './LegalSummary';
import { LegalToc } from './LegalToc';

interface LegalPageProps {
  doc: LegalDocument;
  locale: Locale;
}

export const LegalPage: React.FC<LegalPageProps> = async ({ doc, locale }) => {
  const t = await getTranslations('Legal');
  const tCommon = await getTranslations('Common');
  const tocItems = getTocItems(doc);
  const minutes = getReadingMinutes(doc);
  const formattedDate = formatLegalDate(doc.lastUpdated, locale);

  const tocLabels = {
    onThisPage: t('onThisPage'),
    tableOfContents: t('tableOfContents'),
  };

  return (
    <div className="flex flex-col items-center w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildLegalJsonLd(doc, locale, tCommon('home'))).replace(
            /</g,
            '\\u003c',
          ),
        }}
      />
      <div className="container flex-col pb-20 lg:pb-28">
        <LegalHero doc={doc} formattedDate={formattedDate} minutes={minutes} locale={locale} />

        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] print:grid-cols-1 gap-16">
          <aside className="hidden lg:block print:hidden">
            <LegalToc items={tocItems} variant="desktop" labels={tocLabels} />
          </aside>

          <article className="max-w-[72ch] break-words print:max-w-none">
            <LegalToc items={tocItems} variant="mobile" labels={tocLabels} />
            <LegalSummary points={doc.summary} />
            <div className="flex flex-col gap-4 pb-10">
              {doc.intro.map((paragraph) => (
                <p key={paragraph} className="text-lg lg:text-xl leading-relaxed text-black">
                  {paragraph}
                </p>
              ))}
            </div>
            {doc.sections.map((section, index) => (
              <LegalSection
                key={tocItems[index].id}
                section={section}
                id={tocItems[index].id}
                number={tocItems[index].number}
              />
            ))}
            <LegalContactCard slug={doc.slug} locale={locale} />
          </article>
        </div>
      </div>
      <div className="print:hidden w-full">
        <LetsTalk />
      </div>
    </div>
  );
};
