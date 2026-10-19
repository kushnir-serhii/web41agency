import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { ICaseStudy } from '@/content/caseStudiesContent';
import { Link } from '@/i18n/navigation';

type CaseHeroProps = Pick<
  ICaseStudy,
  'title' | 'industry' | 'summary' | 'cover' | 'tags' | 'liveUrl'
>;

export const CaseHero = async ({
  title,
  industry,
  summary,
  cover,
  tags,
  liveUrl,
}: CaseHeroProps) => {
  const t = await getTranslations('CaseStudy');
  const tNav = await getTranslations('Nav');

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-start gap-10 px-4 lg:px-20 pt-[140px] lg:pt-[120px] pb-10">
      <nav aria-label={t('breadcrumb')} className="text-lg text-black/60">
        <Link
          href="/portfolio"
          className="inline-flex min-h-11 items-center hover:text-black focus-visible:text-black underline-offset-4 hover:underline"
        >
          {tNav('portfolio')}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-black">{title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-8 lg:gap-16">
        <div className="flex flex-col items-start gap-6 w-full lg:max-w-[760px]">
          <p className="text-base lg:text-lg uppercase tracking-wide text-black/60">{industry}</p>
          <h1 className="text-[44px] lg:text-[72px] font-bold leading-tight text-left text-black">
            {title}
          </h1>
          <ul className="flex flex-wrap items-start gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="flex justify-center items-center px-4 py-2 rounded-[100px] border border-black/10 text-lg leading-[18px] text-black whitespace-nowrap"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-6 w-full lg:max-w-[440px]">
          <p className="text-lg lg:text-xl leading-relaxed text-left text-black">{summary}</p>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-lg font-bold text-black underline underline-offset-4 hover:no-underline"
            >
              {t('visitLive')}
            </a>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-[1280/720] rounded-lg overflow-hidden bg-bg_item">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1280px"
          className="object-cover"
        />
      </div>
    </section>
  );
};
