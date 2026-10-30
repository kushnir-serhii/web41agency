import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

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

// TODO(content): messengers are a placeholder below — replace with the real links
// (and remove this comment) once they're finalized. Web41 has no physical address,
// so there is deliberately no Address row.
export default async function ContactsPage() {
  const t = await getTranslations('ContactsPage');

  return (
    <div className="flex flex-col items-center w-full">
      <PageHero
        heading={[{ text: t('headingMain') }, { text: t('headingMuted'), muted: true }]}
        description={t('description')}
      />
      <div className="container flex-col gap-1 pt-8 lg:pt-12 pb-10 lg:pb-16">
        <p className="text-lg text-black">
          <span className="font-semibold">{t('emailLabel')}</span>{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-11 items-center hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="text-lg text-black/70">
          <span className="font-semibold text-black">{t('messengersLabel')}</span> {t('comingSoon')}
        </p>
      </div>
      <LetsTalk />
    </div>
  );
}
