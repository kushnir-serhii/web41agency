import { getTranslations } from 'next-intl/server';

import type { LegalSectionData } from '@/content/legal/types';

interface LegalSectionProps {
  section: LegalSectionData;
  id: string;
  number: string;
}

export const LegalSection: React.FC<LegalSectionProps> = async ({ section, id, number }) => {
  const t = await getTranslations('Legal');
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-32 flex flex-col gap-4 border-t border-black/10 py-10 first:border-t-0 first:pt-0"
    >
      <div className="group flex items-baseline gap-4">
        <span className="text-black/40 tabular-nums text-lg lg:text-xl font-semibold">
          {number}
        </span>
        <h2 id={headingId} className="text-2xl lg:text-3xl font-semibold text-black">
          {section.heading}
        </h2>
        <a
          href={`#${id}`}
          aria-label={t('linkTo', { heading: section.heading })}
          className="inline-flex items-center justify-center min-w-11 min-h-11 -my-3 text-2xl text-black opacity-40 lg:opacity-0 lg:group-hover:opacity-40 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded"
        >
          #
        </a>
      </div>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-lg leading-relaxed text-black">
          {paragraph}
        </p>
      ))}

      {section.list && (
        <ul className="flex flex-col gap-2 text-lg leading-relaxed text-black">
          {section.list.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-black/40"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
