export interface IProject {
  image: string;
  title: string;
  tags: string[];
  href: string;
}

export const portfolioContent: { sectionTitle: string; projects: IProject[] } = {
  sectionTitle: "Portfolio",
  projects: [
    {
      image: "/images/projects/reel-reveal.webp",
      title: "AI Powered Movie Matching Web Application and Website",
      tags: ["Design", "Development", "OpenAI"],
      href: "/portfolio",
    },
    {
      image: "/images/projects/qa.webp",
      title: "Website for QA Freelancer",
      tags: ["Design", "Development", "Portfolio"],
      href: "/portfolio",
    },
    {
      image: "/images/projects/portfolio-dev.webp",
      title: "Full Stack Developer Portfolio Website",
      tags: ["Design", "Development", "Landing Page"],
      href: "/portfolio",
    },
    {
      image: "/images/projects/low-code.webp",
      title: "Low Code Mobile Development Landing Page",
      tags: ["Design", "Low-Code", "Landing Page"],
      href: "/portfolio",
    },
    {
      image: "/images/projects/building.webp",
      title: "Corporate Website for Construction Company",
      tags: ["Design", "Development", "Corporate Website"],
      href: "/portfolio",
    },
    {
      image: "/images/projects/invest.webp",
      title: "Landing Page for Saas Platform",
      tags: ["Design", "Dashboard", "Landing Page"],
      href: "/portfolio",
    },
    {
      image: "/images/projects/marketing.webp",
      title: "Digital Marketing Website",
      tags: ["Design", "Corporate Website", "Marketing"],
      href: "/portfolio",
    },
    {
      image: "/images/projects/portfolio-design.webp",
      title: "Designer’s Portfolio Website",
      tags: ["Design", "Portfolio", "Framer"],
      href: "/portfolio",
    },
  ],
};
