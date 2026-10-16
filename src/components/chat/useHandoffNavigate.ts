'use client';

import { useReducedMotion } from 'motion/react';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';

import { CONSULTATION_HREF } from '@/content/ctaLinks';
import { usePathname, useRouter } from '@/i18n/navigation';
import { trackEvent } from '@/utils/analytics';

const TARGET_ID = CONSULTATION_HREF.slice(1);

/**
 * Click handler for the "Get a free quote" links. Closes the panel (without
 * returning focus to the launcher) and takes the visitor to the form.
 * Modified clicks keep native behaviour (new tab etc.).
 */
export const useHandoffNavigate = (
  onNavigate: () => void,
  location: 'handoff_card' | 'long_chat',
) => {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const locale = useLocale();

  return useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Counted before the modified-click bail-out: ctrl/middle-click is still intent.
      trackEvent({ name: 'chat_handoff_click', props: { location, locale } });
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      onNavigate();

      if (pathname !== '/') {
        router.push(`/${CONSULTATION_HREF}`);
        return;
      }

      const target = document.getElementById(TARGET_ID);
      if (!target) return;
      target.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', CONSULTATION_HREF);
      target.focus({ preventScroll: true });
    },
    [onNavigate, location, locale, pathname, router, shouldReduceMotion],
  );
};
