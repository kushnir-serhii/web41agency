import { useTranslations } from 'next-intl';

export const SkipLink: React.FC = () => {
  const t = useTranslations('Common');

  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-200 focus-visible:flex focus-visible:min-h-11 focus-visible:items-center focus-visible:rounded-full focus-visible:bg-black focus-visible:px-5 focus-visible:text-base focus-visible:font-bold focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent print:hidden"
    >
      {t('skipToContent')}
    </a>
  );
};
