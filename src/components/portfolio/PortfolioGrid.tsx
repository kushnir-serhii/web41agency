import { IProject } from "@/content/portfolioContent";
import { ProjectCard } from "./portfolioComponents/ProjectCard";

interface PortfolioGridProps {
  projects: IProject[];
}

const cardImage = "aspect-[628/500]";

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ projects }) => {
  const leftColumn = projects.filter((_, index) => index % 2 === 0);
  const rightColumn = projects.filter((_, index) => index % 2 !== 0);

  return (
    <section className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-6 px-4 lg:px-20 py-20">
      <div className="flex flex-col gap-16 lg:gap-20">
        {leftColumn.map((project) => (
          <ProjectCard
            key={project.title}
            {...project}
            imageClassName={cardImage}
          />
        ))}
      </div>

      {/* The right column sits lower, as in the design */}
      <div className="flex flex-col gap-16 lg:gap-20 lg:mt-[150px]">
        {rightColumn.map((project) => (
          <ProjectCard
            key={project.title}
            {...project}
            imageClassName={cardImage}
          />
        ))}
      </div>
    </section>
  );
};
