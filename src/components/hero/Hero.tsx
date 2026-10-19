import { getTranslations } from 'next-intl/server';

import { PageHero } from '@/components/pageHero/PageHero';

import { HeroAnimation } from './heroComponents/HeroAnimation';

export const Hero = async () => {
  const t = await getTranslations('Hero');

  return (
    <PageHero
      heading={[{ text: t('headingLead'), muted: true }, { text: t('headingMain') }]}
      description={t('description')}
      secondaryButton={t('secondaryButton')}
    >
      <HeroAnimation />
    </PageHero>
  );
};
