'use client';

import { useEffect, useState } from 'react';

import { isTeaserShown, markTeaserShown } from '@/components/chat/chatStorage';
import { CHAT_LIMITS } from '@/consts/chat';
import { CHAT_NO_TEASER_PATHS } from '@/content/chatContent';
import { usePathname } from '@/i18n/navigation';

const isSuppressed = (pathname: string): boolean =>
  (CHAT_NO_TEASER_PATHS as readonly string[]).includes(pathname.replace(/\/$/, '') || '/');

/** Shows the teaser once per tab session, after the delay, never while the chat is open. */
export function useChatTeaser(isChatOpen: boolean): { isVisible: boolean; hide: () => void } {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const suppressed = isSuppressed(pathname);

  useEffect(() => {
    if (isChatOpen) {
      // Opening the chat counts as having seen the offer.
      markTeaserShown();
      setIsVisible(false);
      return;
    }
    if (suppressed) {
      setIsVisible(false);
      return;
    }
    if (isTeaserShown()) return;
    const timer = setTimeout(() => {
      markTeaserShown();
      setIsVisible(true);
    }, CHAT_LIMITS.teaserDelayMs);
    return () => clearTimeout(timer);
  }, [pathname, suppressed, isChatOpen]);

  return { isVisible, hide: () => setIsVisible(false) };
}
