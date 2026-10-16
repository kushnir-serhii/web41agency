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
  ctaText: string;
}

export interface HowItWorksContent {
  sectionTitle: string;
  mainContent: { id: HowItWorksId; logoId: string; title: string; description: string }[];
  cta: { title: string; text: string; href: string };
}

const howItWorksSectionEn: HowItWorksSectionCopy = {
  sectionTitle: 'How it works',
  ctaTitle: 'Ready to start?',
  ctaText: 'Free Consultation',
};

const howItWorksEn = {
  vision: {
    title: 'Tell Us Your Vision',
    description:
      'Share your goals, ideas, and requirements. We’ll discuss whether you need a fully custom-coded solution or a fast, scalable Webflow site.',
  },
  build: {
    title: 'We Build & Iterate',
    description:
      'Our team designs and develops your website or web app, keeping you in the loop with regular updates and iterations.',
  },
  launch: {
    title: 'Launch & Grow',
    description:
      'We deliver a high-performance, scalable solution, ensuring seamless deployment and providing support to help your business thrive.',
  },
} satisfies Record<HowItWorksId, HowItWorksStepCopy>;

const howItWorksSectionCopy = {
  en: howItWorksSectionEn,
  uk: {
    sectionTitle: 'Як це працює',
    ctaTitle: 'Готові почати?',
    ctaText: 'Безкоштовна оцінка',
  },
} satisfies Record<Locale, HowItWorksSectionCopy>;

const howItWorksCopy = {
  en: howItWorksEn,
  uk: {
    vision: {
      title: 'Розкажіть про своє бачення',
      description:
        'Поділіться цілями, ідеями та вимогами. Ми обговоримо, чи потрібне вам повністю індивідуальне рішення на коді, чи швидкий масштабований сайт на Webflow.',
    },
    build: {
      title: 'Створюємо та вдосконалюємо',
      description:
        'Наша команда проєктує й розробляє ваш сайт або вебзастосунок, регулярно інформуючи вас про оновлення та ітерації.',
    },
    launch: {
      title: 'Запуск і зростання',
      description:
        'Ми передаємо продуктивне, масштабоване рішення, забезпечуємо плавний запуск і підтримку, щоб ваш бізнес розвивався.',
    },
  },
} satisfies Record<Locale, Record<HowItWorksId, HowItWorksStepCopy>>;

export function getHowItWorks(locale: Locale): HowItWorksContent {
  const { sectionTitle, ctaTitle, ctaText } = howItWorksSectionCopy[locale];
  return {
    sectionTitle,
    mainContent: howItWorksBase.map((base) => ({ ...base, ...howItWorksCopy[locale][base.id] })),
    cta: { title: ctaTitle, text: ctaText, href: CONSULTATION_HREF },
  };
}
