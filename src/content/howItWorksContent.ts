// Server-side accessor: call getHowItWorks from server components and pass the result
// down as props (`server-only` is not installed, so not enforced).
import type { Locale } from '@/i18n/types';

import { CONSULTATION_HREF } from './ctaLinks';

const howItWorksBase = [
  { id: 'vision', logoId: 'icon-vision' },
  { id: 'build', logoId: 'icon-iterate' },
  { id: 'launch', logoId: 'icon-grow' },
] as const;

export type HowItWorksId = (typeof howItWorksBase)[number]['id'];

interface HowItWorksStepCopy {
  title: string;
  description: string;
}

interface HowItWorksSectionCopy {
  sectionTitle: string;
  ctaTitle: string;
}

export interface HowItWorksContent {
  sectionTitle: string;
  mainContent: { id: HowItWorksId; logoId: string; title: string; description: string }[];
  cta: { title: string; href: string };
}

const howItWorksSectionEn: HowItWorksSectionCopy = {
  sectionTitle: 'How it works',
  ctaTitle: 'Ready to start?',
};

const howItWorksEn = {
  vision: {
    title: 'Tell us what you need',
    description:
      'Share your goals and ideas. We listen, ask the right questions, and recommend the simplest option that fits: a quick Webflow site or a custom build.',
  },
  build: {
    title: 'We build, you review',
    description:
      'We design and develop your website or web app, and show you progress along the way so nothing comes as a surprise.',
  },
  launch: {
    title: 'Launch and grow',
    description:
      'We launch a fast site or app that is ready to grow, and stay available for support after it goes live.',
  },
} satisfies Record<HowItWorksId, HowItWorksStepCopy>;

const howItWorksSectionCopy = {
  en: howItWorksSectionEn,
  uk: {
    sectionTitle: 'Як це працює',
    ctaTitle: 'Готові почати?',
  },
} satisfies Record<Locale, HowItWorksSectionCopy>;

const howItWorksCopy = {
  en: howItWorksEn,
  uk: {
    vision: {
      title: 'Розкажіть, що вам потрібно',
      description:
        'Поділіться цілями та ідеями. Ми вислухаємо, поставимо потрібні запитання й запропонуємо найпростіший варіант, який підходить: швидкий сайт на Webflow або індивідуальну розробку.',
    },
    build: {
      title: 'Робимо, а ви дивитесь',
      description:
        'Ми проєктуємо й розробляємо ваш сайт або вебзастосунок і показуємо результат по ходу роботи, щоб жодна несподіванка не зіпсувала запуск.',
    },
    launch: {
      title: 'Запуск і зростання',
      description:
        'Запускаємо швидкий сайт чи застосунок, готовий до росту, і залишаємося на зв’язку для підтримки після запуску.',
    },
  },
} satisfies Record<Locale, Record<HowItWorksId, HowItWorksStepCopy>>;

export function getHowItWorks(locale: Locale): HowItWorksContent {
  const { sectionTitle, ctaTitle } = howItWorksSectionCopy[locale];
  return {
    sectionTitle,
    mainContent: howItWorksBase.map((base) => ({ ...base, ...howItWorksCopy[locale][base.id] })),
    cta: { title: ctaTitle, href: CONSULTATION_HREF },
  };
}
