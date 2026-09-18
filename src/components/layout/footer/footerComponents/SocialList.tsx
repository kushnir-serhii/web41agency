import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { CONTACT_EMAIL } from '@/utils/site';

export const SocialList: React.FC = () => {
  return (
    <ul className="flex flex-row lg:flex-col justify-center lg:justify-between items-center gap-12 lg:gap-0 h-auto lg:h-48">
      <li className="flex justify-center items-center text-base text-white">
        <Link
          href={'https://www.instagram.com/web41.agency/'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
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
          aria-label="Dribbble"
          className="flex size-11 items-center justify-center rounded-full"
        >
          <Icon id="icon-dribbble" width={34} height={34} />
        </Link>
      </li>
      <li className="flex justify-center items-center text-base text-white">
        <Link
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label="Email us"
          className="flex size-11 items-center justify-center rounded-full"
        >
          <Icon id="icon-email" width={34} height={34} />
        </Link>
      </li>
    </ul>
  );
};
