import { getTranslations } from 'next-intl/server';

import { Icon } from '@/components/ui/Icon';
import { Link } from '@/i18n/navigation';
import { CONTACT_EMAIL } from '@/utils/site';

export const SocialList: React.FC = async () => {
  const t = await getTranslations('Footer');

  return (
    <ul className="flex flex-row lg:flex-col justify-center lg:justify-between items-center gap-12 lg:gap-0 h-auto lg:h-48">
      <li className="flex justify-center items-center text-base text-white">
        <Link
          href={'https://www.instagram.com/web41.agency/'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('instagram')}
          className="flex size-11 items-center justify-center rounded-full"
        >
          <Icon id="icon-instagram" width={34} height={34} />
        </Link>
      </li>
      <li className="flex justify-center items-center text-base text-white">
        <Link
          href={'https://www.dribbble.com/web41'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('dribbble')}
          className="flex size-11 items-center justify-center rounded-full"
        >
          <Icon id="icon-dribbble" width={34} height={34} />
        </Link>
      </li>
      <li className="flex justify-center items-center text-base text-white">
        <Link
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label={t('email')}
          className="flex size-11 items-center justify-center rounded-full"
        >
          <Icon id="icon-email" width={34} height={34} />
        </Link>
      </li>
    </ul>
  );
};
