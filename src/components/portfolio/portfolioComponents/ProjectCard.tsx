import { IProject } from '@/content/portfolioContent';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps extends IProject {
  /* Sizing for the cover — the slider uses fixed heights, the grid an aspect ratio. */
  imageClassName?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  tags,
  href,
  imageClassName = 'h-[240px] lg:h-[371px]',
}) => {
  return (
    <Link href={href} className="flex flex-col items-start gap-4 w-full group">
      <div className={`relative w-full rounded-lg overflow-hidden ${imageClassName}`}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 90vw, 416px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col items-start gap-2 w-full">
        <h3 className="text-2xl lg:text-[32px] font-semibold leading-[1.2] text-left text-black">
          {title}
        </h3>
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
    </Link>
  );
};
