'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { NavBar } from '@/components/layout/navBar/NavBar';
import { NavBarItem } from '@/components/layout/navBar/NavBarItem';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { CONSULTATION_HREF } from '@/content/ctaLinks';
import { navBarArray } from '@/content/navBarArray';
import { Link, usePathname } from '@/i18n/navigation';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const tHeader = useTranslations('Header');
  const tNav = useTranslations('Nav');
  const tCta = useTranslations('Cta');

  // Lets the chat launcher hide itself (CSS-only) while the mobile menu is open.
  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.dataset.menuOpen = '';
    return () => {
      delete document.documentElement.dataset.menuOpen;
    };
  }, [isOpen]);

  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // A route change closes the menu (hash links like #lets-talk close via their own onClick).
  useEffect(() => setIsOpen(false), [pathname]);

  // Open: focus the first link. Escape closes and returns focus to the toggle;
  // a click outside the header closes without stealing focus.
  useEffect(() => {
    if (!isOpen) return;
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative w-full px-2 lg:px-20 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-center max-w-[1280px] w-full mx-auto pl-4 pr-2 py-2 rounded-[100px] bg-bg_header/30 backdrop-blur-[100px]">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:block min-w-0 flex-1 xl:max-w-[793px] mx-2 whitespace-nowrap">
          <NavBar />
        </nav>
        <LanguageSwitcher variant="pill" className="hidden shrink-0 lg:inline-flex" />

        {/* Mobile hamburger */}
        <button
          ref={toggleRef}
          type="button"
          aria-label={isOpen ? tHeader('closeMenu') : tHeader('openMenu')}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="lg:hidden flex size-11 items-center justify-center rounded-full"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? (
            <div className="size-11 rounded-full bg-accent flex items-center justify-center">
              <Icon id="icon-cross" width={14} height={14} />
            </div>
          ) : (
            <Icon id="icon-icon-menu" width={40} height={40} />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-2 right-2 mt-2 z-50 rounded-3xl bg-white/90 backdrop-blur-[100px] shadow-xl overflow-hidden"
          >
            <ul className="flex flex-col py-4">
              {navBarArray.map(({ href, labelKey }) => (
                <li key={href} onClick={() => setIsOpen(false)}>
                  <NavBarItem link={href} text={tNav(labelKey)} isActive={pathname === href} />
                </li>
              ))}
              <li className="px-4 pt-2">
                <LanguageSwitcher variant="full" />
              </li>
              <li className="px-4 pt-2">
                <Link
                  href={CONSULTATION_HREF}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center px-4 py-3 rounded-[100px] text-white bg-black"
                >
                  {tCta('freeQuote')}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
