import { formatPrice, PRICING } from '@/content/pricing';

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
  sectionTitle: 'Services',
  services: [
    {
      title: 'Landing Page',
      description:
        'A focused one-page site that turns visitors into leads — fast to launch, easy to update.',
      price: formatPrice(PRICING.landing),
      timeline: '3–7 days',
    },
    {
      title: 'JS Development',
      description:
        'Custom-built websites and web apps with pure code. We develop high-performance, scalable solutions using JS and modern frameworks.',
      price: formatPrice(PRICING.custom),
      // TODO(owner): confirm timeline
      timeline: '4–8 weeks, scope-dependent',
    },
    {
      title: 'Low Code',
      description:
        'Fast, flexible Webflow builds — perfect when you need to launch quickly with a site your team can manage without a developer.',
      price: formatPrice(PRICING.lowCode),
      timeline: '2–4 weeks',
    },
    {
      title: 'API Integrations',
      description:
        'We connect your product to payments, CRMs, AI services and any third-party data your business runs on.',
      price: formatPrice(PRICING.apiIntegrations),
      // TODO(owner): confirm timeline
      timeline: '1–3 weeks, scope-dependent',
    },
    {
      title: 'UI/UX Design',
      description:
        'Interfaces designed around your users — from research and wireframes to a polished, production-ready design system.',
      price: formatPrice(PRICING.uiUxDesign),
      // TODO(owner): confirm timeline
      timeline: '2–4 weeks',
    },
    {
      title: 'Branding',
      description:
        'Logos, visual identity and guidelines that keep your product recognisable everywhere it shows up.',
      price: formatPrice(PRICING.branding),
      // TODO(owner): confirm timeline
      timeline: '1–2 weeks',
    },
  ],
};
