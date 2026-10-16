'use client';

import { useEffect, useRef, useState } from 'react';

// Top inset must exceed the sections' scroll-mt-32 (128px) landing offset, so the
// previous section's bottom edge (at 128px after an anchor jump) stays outside the band.
const ROOT_MARGIN = '-140px 0px -65% 0px';

export const useActiveSection = (ids: string[]): string => {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '');
  const visible = useRef<Set<string>>(new Set());
  const key = ids.join('|');

  useEffect(() => {
    if (ids.length === 0) return;

    const hashId = decodeURIComponent(window.location.hash.slice(1));
    if (hashId && ids.includes(hashId)) setActiveId(hashId);

    const isAtBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const update = () => {
      if (isAtBottom()) {
        setActiveId(ids[ids.length - 1]);
        return;
      }
      const first = ids.find((id) => visible.current.has(id));
      if (first) setActiveId(first);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.current.add(entry.target.id);
          else visible.current.delete(entry.target.id);
        }
        update();
      },
      { rootMargin: ROOT_MARGIN },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    window.addEventListener('scroll', update, { passive: true });
    const set = visible.current;

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      set.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return activeId;
};
