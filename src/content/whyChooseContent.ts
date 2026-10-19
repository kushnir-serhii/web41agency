// Server-side accessor: call getWhyChoose from server components and pass the result
// down as props (`server-only` is not installed, so not enforced).
import type { IWhyChooseContent } from '@/components/whyChoose/WhyChoose';
import { CONSULTATION_HREF } from '@/content/ctaLinks';
import type { Locale } from '@/i18n/types';

// The chat is behind a build-time flag (see the locale layout), so only promise it when it is on.
const chatEnabled = process.env.NEXT_PUBLIC_CHAT_ENABLED === 'true';

const whyChooseBase = [
  { id: 'fast', iconId: 'icon-fast' },
  { id: 'cost', iconId: 'icon-cost' },
  { id: 'flex', iconId: 'icon-flex' },
] as const;

export type WhyChooseId = (typeof whyChooseBase)[number]['id'];

interface Segment {
  text: string;
  highlight: boolean;
}

interface WhyChooseItemCopy {
  title: string;
  description: Segment[];
}

interface WhyChooseSectionCopy {
  sectionTitle: string;
}

const whyChooseSectionEn: WhyChooseSectionCopy = {
  sectionTitle: 'Why choose us',
};

const whyChooseEn = {
  fast: {
    title: 'Fast and efficient',
    description: [
      { text: 'Landing pages go live in ', highlight: false },
      { text: '3–7 days,', highlight: true },
      {
        text: ' and larger builds get a clear timeline before any work starts.',
        highlight: false,
      },
    ],
  },
  cost: {
    title: 'Cost-effective',
    description: [
      { text: 'Pay for what your project needs, nothing extra. You get ', highlight: false },
      { text: 'a clear price before any work starts', highlight: true },
      {
        text: chatEnabled ? ', and our AI assistant can share starting prices anytime.' : '.',
        highlight: false,
      },
    ],
  },
  flex: {
    title: 'Scalable and flexible',
    description: [
      {
        text: 'Whether you need a simple site or a full custom web app, ',
        highlight: false,
      },
      { text: 'we build solutions that grow ', highlight: true },
      { text: 'with your business.', highlight: false },
    ],
  },
} satisfies Record<WhyChooseId, WhyChooseItemCopy>;

const whyChooseSectionCopy = {
  en: whyChooseSectionEn,
  uk: {
    sectionTitle: 'Чому обирають нас',
  },
} satisfies Record<Locale, WhyChooseSectionCopy>;

const whyChooseCopy = {
  en: whyChooseEn,
  uk: {
    fast: {
      title: 'Швидко й ефективно',
      description: [
        { text: 'Лендінги запускаються за ', highlight: false },
        { text: '3–7 днів,', highlight: true },
        {
          text: ' а для більших проєктів ви отримуєте чіткий графік до початку робіт.',
          highlight: false,
        },
      ],
    },
    cost: {
      title: 'Вигідно',
      description: [
        {
          text: 'Ви платите лише за те, що потрібно вашому проєкту. Ви отримуєте ',
          highlight: false,
        },
        { text: 'чітку ціну ще до початку робіт', highlight: true },
        {
          text: chatEnabled ? ', а наш AI-асистент назве стартові ціни будь-коли.' : '.',
          highlight: false,
        },
      ],
    },
    flex: {
      title: 'Масштабовано та гнучко',
      description: [
        {
          text: 'Потрібен простий сайт чи повноцінний індивідуальний вебзастосунок, ',
          highlight: false,
        },
        { text: 'ми створюємо рішення, що зростають ', highlight: true },
        { text: 'разом із вашим бізнесом.', highlight: false },
      ],
    },
  },
} satisfies Record<Locale, Record<WhyChooseId, WhyChooseItemCopy>>;

export function getWhyChoose(locale: Locale): IWhyChooseContent {
  return {
    ...whyChooseSectionCopy[locale],
    href: CONSULTATION_HREF,
    mainContent: whyChooseBase.map(({ iconId, id }) => ({
      iconId,
      ...whyChooseCopy[locale][id],
    })),
  };
}
