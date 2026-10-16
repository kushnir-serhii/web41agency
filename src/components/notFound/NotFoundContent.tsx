import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

export const NotFoundContent: React.FC = () => {
  const t = useTranslations('NotFound');

  return (
    <section className="container flex-col items-center gap-6 py-24 text-center">
      <h1 className="text-4xl font-bold md:text-6xl">{t('heading')}</h1>
      <p className="text-muted_text max-w-xl text-lg">{t('text')}</p>
      <Button text={t('backHome')} href="/" btnType="primary" />
    </section>
  );
};
