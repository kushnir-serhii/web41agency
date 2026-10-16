'use client';

import { useRef } from 'react';

import { LegalTocList, type LegalTocListItem } from './LegalTocList';
import { useActiveSection } from './useActiveSection';

interface LegalTocProps {
  items: LegalTocListItem[];
  variant: 'desktop' | 'mobile';
  labels: { onThisPage: string; tableOfContents: string };
}

export const LegalToc: React.FC<LegalTocProps> = ({ items, variant, labels }) => {
  const activeId = useActiveSection(items.map((item) => item.id));
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (variant === 'desktop') {
    return (
      <nav aria-label={labels.onThisPage} className="sticky top-28 self-start">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-black">
          {labels.onThisPage}
        </p>
        <LegalTocList items={items} activeId={activeId} />
      </nav>
    );
  }

  return (
    <nav aria-label={labels.tableOfContents} className="mb-8 lg:hidden print:hidden">
      <details ref={detailsRef} className="group rounded-lg bg-bg_item">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-3 font-bold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black [&::-webkit-details-marker]:hidden">
          {labels.onThisPage}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div className="px-4 pb-3">
          <LegalTocList
            items={items}
            activeId={activeId}
            onNavigate={() => {
              if (detailsRef.current) detailsRef.current.open = false;
            }}
          />
        </div>
      </details>
    </nav>
  );
};
