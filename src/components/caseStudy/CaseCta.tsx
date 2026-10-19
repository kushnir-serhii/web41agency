import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/Button';
import { ICaseStudy } from '@/content/caseStudiesContent';
import { Link } from '@/i18n/navigation';

interface CaseCtaProps {
  nextCase?: Pick<ICaseStudy, 'slug' | 'title'>;
}

export const CaseCta = async ({ nextCase }: CaseCtaProps) => {
  const t = await getTranslations('CaseStudy');
  const tCta = await getTranslations('Cta');

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 py-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-6 lg:p-12 rounded-lg bg-bg_item">
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-left text-black">{t('ctaTitle')}</h2>
          <p className="text-lg text-black lg:max-w-[520px]">{t('ctaText')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button text={tCta('freeQuote')} href="/contacts" className="w-full sm:w-auto" />
          <Button
            text={t('allProjects')}
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
            <span className="text-base uppercase tracking-wide text-black/60">
              {t('nextProject')}
            </span>
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
