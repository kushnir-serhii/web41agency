import Image from 'next/image';

import { IProject } from '@/content/portfolioContent';
import { Link } from '@/i18n/navigation';

interface ProjectCardProps extends IProject {
  /* Sizing for the cover — the slider uses fixed heights, the grid an aspect ratio. */
  imageClassName?: string;
  readLabel: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  image,
  title,
  tags,
  industry,
  summary,
  metric,
  imageClassName = 'h-[240px] lg:h-[371px]',
  readLabel,
}) => {
  return (
    <Link
      href={`/portfolio/${slug}`}
      className="flex flex-col items-start gap-4 w-full h-full group rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
    >
      <div className={`relative w-full rounded-lg overflow-hidden ${imageClassName}`}>
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 416px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {metric && (
          <span className="absolute left-4 bottom-4 flex items-baseline gap-2 px-4 py-2 rounded-[100px] bg-accent text-black">
            <strong className="text-xl font-bold leading-none">{metric.value}</strong>
            <span className="text-base leading-none">{metric.label}</span>
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 items-start gap-2 w-full">
        <span className="text-base uppercase tracking-wide text-black/60">{industry}</span>
        <h3 className="text-2xl lg:text-[32px] font-semibold leading-[1.2] text-left text-black">
          {title}
        </h3>
        <p className="text-lg leading-snug text-left text-black/80 line-clamp-2">{summary}</p>
        <ul className="flex flex-wrap items-start gap-2 mt-1">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex justify-center items-center px-4 py-2 rounded-[100px] border border-black/10 text-lg leading-[18px] text-black whitespace-nowrap"
            >
              {tag}
            </li>
          ))}
        </ul>
        <span className="mt-auto pt-2 text-lg font-bold text-black underline underline-offset-4 group-hover:no-underline group-focus-visible:no-underline">
          {readLabel} &rarr;
        </span>
      </div>
    </Link>
  );
};
