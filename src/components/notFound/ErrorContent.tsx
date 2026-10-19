'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface ErrorContentProps {
  onRetry: () => void;
}

/** Same layout as NotFoundContent, for the route error boundary: retry first, home as the way out. */
export const ErrorContent: React.FC<ErrorContentProps> = ({ onRetry }) => {
  const t = useTranslations('Error');

  return (
    <section role="alert" className="container flex-col items-center gap-6 py-24 text-center">
      <h1 className="text-4xl font-bold md:text-6xl">{t('heading')}</h1>
      <p className="text-muted_text max-w-xl text-lg">{t('text')}</p>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Button text={t('retry')} btnType="primary" onClick={onRetry} />
        <Button text={t('backHome')} href="/" btnType="ghost" />
      </div>
    </section>
  );
};
