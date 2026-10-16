import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/Button';
import { getOtherLegalDocs } from '@/content/legal';
import type { LegalSlug } from '@/content/legal/types';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/types';
import { CONTACT_EMAIL } from '@/utils/site';

interface LegalContactCardProps {
  slug: LegalSlug;
  locale: Locale;
}

const headingKeys = {
  'privacy-policy': 'questionsPrivacy',
  'terms-of-use': 'questionsTerms',
} as const satisfies Record<LegalSlug, string>;

export const LegalContactCard: React.FC<LegalContactCardProps> = async ({ slug, locale }) => {
  const t = await getTranslations('Legal');

  return (
    <div className="mt-10">
      <section
        aria-labelledby="legal-contact-title"
        className="bg-black text-white rounded-lg p-6 lg:p-8"
      >
        <h2 id="legal-contact-title" className="text-2xl lg:text-3xl font-bold mb-3">
          {t(headingKeys[slug])}
        </h2>
        <p className="text-lg leading-relaxed mb-6">{t('contactBody')}</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            text={t('contactEmail')}
            btnType="accent"
            href={`mailto:${CONTACT_EMAIL}`}
            className="focus-visible:outline-white print:hidden"
          />
          <span className="text-lg break-all">{CONTACT_EMAIL}</span>
        </div>
      </section>
      {getOtherLegalDocs(slug, locale).map((other) => (
        <Link
          key={other.slug}
          href={`/${other.slug}`}
          className="inline-flex items-center min-h-11 mt-4 text-lg font-bold text-black underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black print:hidden"
        >
          {t('alsoRead', { title: other.title })}
        </Link>
      ))}
    </div>
  );
};
