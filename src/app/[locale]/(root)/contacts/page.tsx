import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { PageHero } from '@/components/pageHero/PageHero';
import { buildPageMetadata } from '@/i18n/metadata';
import type { Locale } from '@/i18n/types';
import { CONTACT_EMAIL } from '@/utils/site';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta.contacts' });

  return buildPageMetadata({
    locale,
    path: '/contacts',
    title: t('title'),
    description: t('description'),
  });
};

// TODO(content): messengers and a physical address are placeholders below —
// replace with the real values (and remove this comment) as soon as they're
// finalized, per step 7 of docs/seo-plan-en.md.
export default async function ContactsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ContactsPage');

  return (
    <div className="flex flex-col items-center w-full">
      <PageHero
        heading={[{ text: t('headingMain') }, { text: t('headingMuted'), muted: true }]}
        description={t('description')}
      />
      <div className="container flex-col gap-2 pb-10">
        <p className="text-lg text-black">
          <span className="font-semibold">{t('emailLabel')}</span>{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="text-lg text-black/70">
          <span className="font-semibold text-black">{t('messengersLabel')}</span> {t('comingSoon')}
        </p>
        <p className="text-lg text-black/70">
          <span className="font-semibold text-black">{t('addressLabel')}</span> {t('comingSoon')}
        </p>
      </div>
      <LetsTalk />
    </div>
  );
}
