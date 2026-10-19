'use client';

import { useTranslations } from 'next-intl';

import { CONSULTATION_HREF } from '@/content/ctaLinks';
import { navBarArray } from '@/content/navBarArray';
import { Link, usePathname } from '@/i18n/navigation';

import { NavBarItem } from './NavBarItem';

interface NavBarProps {
  children?: React.ReactNode;
  isFooter?: boolean;
}
export const NavBar: React.FC<NavBarProps> = ({ isFooter }) => {
  const pathName = usePathname();
  const tNav = useTranslations('Nav');
  const tCta = useTranslations('Cta');
  return (
    <ul className={`flex justify-between items-center ${isFooter ? 'flex-col' : 'w-full'}`}>
      {navBarArray.map(({ href, labelKey }) => (
        <li key={href}>
          <NavBarItem
            link={href}
            text={tNav(labelKey)}
            isFooter={isFooter}
            isActive={pathName === href ? true : false}
          />
        </li>
      ))}
      {!isFooter && (
        <li>
          <Link
            href={CONSULTATION_HREF}
            className="flex min-h-11 justify-center items-center px-3 xl:px-4 py-2 rounded-[100px] text-white bg-black"
          >
            {tCta('freeQuote')}
          </Link>
        </li>
      )}
    </ul>
  );
};
