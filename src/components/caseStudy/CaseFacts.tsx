import { ICaseFact } from '@/content/caseStudiesContent';

interface CaseFactsProps {
  facts: ICaseFact[];
}

export const CaseFacts: React.FC<CaseFactsProps> = ({ facts }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 py-10">
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 p-6 lg:p-10 rounded-lg bg-bg_item">
        {facts.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-start gap-2">
            <dt className="text-base uppercase tracking-wide text-black/60">{label}</dt>
            <dd className="text-xl lg:text-2xl font-bold text-black">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
