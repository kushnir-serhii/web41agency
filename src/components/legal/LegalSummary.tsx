import { getTranslations } from 'next-intl/server';

import { Icon } from '@/components/ui/Icon';

interface LegalSummaryProps {
  points: string[];
}

export const LegalSummary: React.FC<LegalSummaryProps> = async ({ points }) => {
  const t = await getTranslations('Legal');

  return (
    <section
      aria-labelledby="legal-summary-title"
      className="bg-bg_item rounded-lg p-6 lg:p-8 mb-10"
    >
      <h2 id="legal-summary-title" className="text-2xl lg:text-3xl font-bold text-black mb-6">
        {t('atAGlance')}
      </h2>
      <ul className="grid md:grid-cols-2 gap-4">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-lg leading-relaxed text-black">
            <span className="flex shrink-0 justify-center items-center size-7 rounded-full bg-accent">
              <Icon id="icon-check" width={16} height={16} className="fill-black" />
            </span>
            <span className="min-w-0 break-words">{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
