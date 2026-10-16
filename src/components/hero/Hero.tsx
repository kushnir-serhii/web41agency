import { getTranslations } from 'next-intl/server';

import { PageHero } from '@/components/pageHero/PageHero';

import { HeroAnimation } from './heroComponents/HeroAnimation';

export const Hero = async () => {
  const t = await getTranslations('Hero');

  return (
    <PageHero
      heading={[
        { text: t('headingCustom'), muted: true },
        { text: t('headingMain') },
        { text: t('headingPerform'), muted: true },
      ]}
      description={t('description')}
      primaryButton={t('primaryButton')}
      secondaryButton={t('secondaryButton')}
    >
      <HeroAnimation slideLabel={t('slideAlt')} />
    </PageHero>
  );
};
