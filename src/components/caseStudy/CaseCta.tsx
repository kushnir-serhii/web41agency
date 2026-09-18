import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { ICaseStudy } from '@/content/caseStudiesContent';

interface CaseCtaProps {
  nextCase?: Pick<ICaseStudy, 'slug' | 'title'>;
}

export const CaseCta: React.FC<CaseCtaProps> = ({ nextCase }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 py-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-6 lg:p-12 rounded-lg bg-bg_item">
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-left text-black">
            Got a project like this one?
          </h2>
          <p className="text-lg text-black lg:max-w-[520px]">
            Tell us what you are building. We will come back with an approach, a timeline and a
            price before you commit to anything.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button text="Free Consultation" href="/contacts" className="w-full sm:w-auto" />
          <Button
            text="All projects"
            btnType="ghost"
            href="/portfolio"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {nextCase && (
        <Link
          href={`/portfolio/${nextCase.slug}`}
          className="group flex items-center justify-between gap-4 w-full mt-10 py-8 border-t border-black/10"
        >
          <span className="flex flex-col items-start gap-1">
            <span className="text-base uppercase tracking-wide text-black/60">Next project</span>
            <span className="text-2xl lg:text-4xl font-bold text-black group-hover:underline underline-offset-4">
              {nextCase.title}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-3xl lg:text-4xl text-black transition-transform duration-300 group-hover:translate-x-2"
          >
            &rarr;
          </span>
        </Link>
      )}
    </section>
  );
};
