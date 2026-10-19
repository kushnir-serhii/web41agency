import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { SITE_NAME } from '@/utils/site';

const linkClass =
  'flex min-h-11 items-center justify-center flex-grow-0 flex-shrink-0 text-base text-center text-[#f9f9f9] hover:underline';

export const PrivacyAndTerms: React.FC = async () => {
  const t = await getTranslations('Footer');

  return (
    <div className="container flex-row flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-x-6 gap-y-2 lg:gap-0 self-stretch relative pt-10 border-t border-r-0 border-b-0 border-l-0 border-white/20">
      <Link href="/privacy-policy" className={linkClass}>
        {t('privacyPolicy')}
      </Link>
      <p className="order-last basis-full text-center lg:order-none lg:basis-auto flex-grow-0 flex-shrink-0 text-base text-center text-[#f9f9f9]">
        © {new Date().getFullYear()} {SITE_NAME}. {t('rights')}
      </p>
      <Link href="/terms-of-use" className={linkClass}>
        {t('termsOfUse')}
      </Link>
    </div>
  );
};
