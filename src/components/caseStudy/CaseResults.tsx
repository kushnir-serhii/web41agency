import { ICaseFact } from '@/content/caseStudiesContent';

interface CaseResultsProps {
  results: ICaseFact[];
}

export const CaseResults: React.FC<CaseResultsProps> = ({ results }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 py-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-16">
        <h2 className="w-full lg:w-[380px] shrink-0 text-3xl lg:text-[40px] font-bold leading-tight text-left text-black">
          Results
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full lg:max-w-[720px]">
          {results.map(({ label, value }) => (
            /* <dt> must come first in the markup; flex-col-reverse puts the number on top. */
            <div key={label} className="flex flex-col-reverse items-start gap-2">
              <dt className="text-lg text-black/70">{label}</dt>
              <dd className="text-5xl lg:text-[64px] font-bold leading-none text-black">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
