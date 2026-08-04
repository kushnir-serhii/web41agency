export interface IService {
  title: string;
  description: string;
}

export const servicesContent: {
  sectionTitle: string;
  services: IService[];
} = {
  sectionTitle: "Services",
  services: [
    {
      title: "JS Development",
      description:
        "Custom-built websites and web apps with pure code. We develop high-performance, scalable solutions using JS and modern frameworks.",
    },
    {
      title: "Low Code",
      description:
        "Fast, flexible Webflow builds — perfect when you need to launch quickly with a site your team can manage without a developer.",
    },
    {
      title: "API Integrations",
      description:
        "We connect your product to payments, CRMs, AI services and any third-party data your business runs on.",
    },
    {
      title: "UI/UX Design",
      description:
        "Interfaces designed around your users — from research and wireframes to a polished, production-ready design system.",
    },
    {
      title: "Branding",
      description:
        "Logos, visual identity and guidelines that keep your product recognisable everywhere it shows up.",
    },
  ],
};
