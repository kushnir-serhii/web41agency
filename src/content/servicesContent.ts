export interface IService {
  title: string;
  description: string;
  price: string;
  timeline: string;
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
      price: "From $120",
      timeline: "1–3 weeks, scope-dependent",
    },
    {
      title: "Low Code",
      description:
        "Fast, flexible Webflow builds — perfect when you need to launch quickly with a site your team can manage without a developer.",
      price: "From $120",
      timeline: "1–3 weeks, scope-dependent",
    },
    {
      title: "API Integrations",
      description:
        "We connect your product to payments, CRMs, AI services and any third-party data your business runs on.",
      price: "From $120",
      timeline: "1–3 weeks, scope-dependent",
    },
    {
      title: "UI/UX Design",
      description:
        "Interfaces designed around your users — from research and wireframes to a polished, production-ready design system.",
      price: "From $120",
      timeline: "1–3 weeks, scope-dependent",
    },
    {
      title: "Branding",
      description:
        "Logos, visual identity and guidelines that keep your product recognisable everywhere it shows up.",
      price: "From $120",
      timeline: "1–3 weeks, scope-dependent",
    },
  ],
};
