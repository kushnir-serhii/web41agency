'use client';

import { useEffect, useState } from 'react';

import { usePathname } from '@/i18n/navigation';

const FORM_SELECTOR = '#lets-talk form';
// Launcher footprint: 56px button + 16px offset + 8px margin at the bottom edge.
const ROOT_MARGIN = '0px 0px -80px 0px';

/**
 * True while the "Let's talk" form is in the viewport (above the launcher's corner).
 * Re-observes on route change and when the form mounts after the hook. Inactive when `enabled` is false.
 */
export function useFormInView(enabled: boolean): boolean {
  const pathname = usePathname();
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsInView(false);
      return;
    }

    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    const attach = (form: Element) => {
      io = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
        rootMargin: ROOT_MARGIN,
      });
      io.observe(form);
    };

    const form = document.querySelector(FORM_SELECTOR);
    if (form) {
      attach(form);
    } else {
      setIsInView(false);
      mo = new MutationObserver(() => {
        const found = document.querySelector(FORM_SELECTOR);
        if (!found) return;
        mo?.disconnect();
        mo = null;
        attach(found);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
      setIsInView(false);
    };
  }, [enabled, pathname]);

  return isInView;
}
