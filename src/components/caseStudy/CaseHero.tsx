import { ICaseStudy } from '@/content/caseStudiesContent';
import Image from 'next/image';
import Link from 'next/link';

type CaseHeroProps = Pick<ICaseStudy, 'title' | 'industry' | 'summary' | 'cover' | 'tags' | 'liveUrl'>;

export const CaseHero: React.FC<CaseHeroProps> = ({
  title,
  industry,
  summary,
  cover,
  tags,
  liveUrl,
}) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-start gap-10 px-4 lg:px-20 pt-[140px] lg:pt-[120px] pb-10">
      <nav aria-label="Breadcrumb" className="text-lg text-black/60">
        <Link href="/portfolio" className="hover:text-black focus-visible:text-black underline-offset-4 hover:underline">
          Portfolio
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
              className="text-lg font-bold text-black underline underline-offset-4 hover:no-underline"
            >
              Visit the live site
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
