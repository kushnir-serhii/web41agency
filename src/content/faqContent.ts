// Server-side accessor: call getFaq from server components and pass the result down
// as props (`server-only` is not installed, so not enforced).
import type { Locale } from '@/i18n/types';

const faqBase = [
  { id: 'low-vs-pure-code' },
  { id: 'which-solution' },
  { id: 'design-services' },
  { id: 'build-time' },
  { id: 'self-update' },
  { id: 'post-launch-support' },
] as const;

export type FaqId = (typeof faqBase)[number]['id'];

interface FaqCopy {
  question: string;
  answer: string;
}

export interface IFaqItem extends FaqCopy {
  id: FaqId;
}

const faqEn = {
  'low-vs-pure-code': {
    question: 'What’s the difference between low and pure code?',
    answer:
      'Webflow allows us to create visually stunning, no-code websites that are easy to manage, perfect for fast turnarounds. JavaScript development, using Next.js and TypeScript, is ideal for fully custom, high-performance web applications with complex functionality.',
  },
  'which-solution': {
    question: 'How do I know which solution is right for me?',
    answer:
      'We start with a free consultation: we look at your goals, timeline and budget, then recommend the approach that gets you there fastest without boxing you in later.',
  },
  'design-services': {
    question: 'Do you offer design services as well?',
    answer:
      'Yes. We cover the full process — research, UX, UI and brand identity — and hand off a design system your developers can build on, or build it ourselves.',
  },
  'build-time': {
    question: 'How long does it take to build a website?',
    answer:
      'A Webflow site typically takes 2–4 weeks. A custom JavaScript application depends on scope, and we give you a detailed timeline before any work starts.',
  },
  'self-update': {
    question: 'Can I update my website myself after launch?',
    answer:
      'Absolutely. Webflow sites come with a CMS you can edit yourself, and for custom builds we can add an admin panel so your team stays independent.',
  },
  'post-launch-support': {
    question: 'Do you offer post-launch support?',
    answer:
      'Yes. We offer ongoing support and maintenance packages covering updates, monitoring, and new features as your product grows.',
  },
} satisfies Record<FaqId, FaqCopy>;

const faqSectionCopy = {
  en: { sectionTitle: 'FAQ' },
  uk: { sectionTitle: 'Поширені запитання' },
} satisfies Record<Locale, { sectionTitle: string }>;

const faqCopy = {
  en: faqEn,
  uk: {
    'low-vs-pure-code': {
      question: 'Яка різниця між low-code і чистим кодом?',
      answer:
        'Webflow дозволяє створювати вражаючі no-code сайти, якими легко керувати, — це ідеально для швидких термінів. Розробка на JavaScript із Next.js і TypeScript підходить для повністю індивідуальних, високопродуктивних вебзастосунків зі складним функціоналом.',
    },
    'which-solution': {
      question: 'Як зрозуміти, яке рішення мені підходить?',
      answer:
        'Ми починаємо з безкоштовної консультації: вивчаємо ваші цілі, терміни та бюджет, а потім рекомендуємо підхід, який приведе вас до результату найшвидше і не обмежить надалі.',
    },
    'design-services': {
      question: 'Ви також надаєте послуги з дизайну?',
      answer:
        'Так. Ми охоплюємо весь процес — дослідження, UX, UI та айдентику бренду — і передаємо дизайн-систему, на основі якої ваші розробники можуть працювати далі, або реалізуємо її самі.',
    },
    'build-time': {
      question: 'Скільки часу займає створення сайту?',
      answer:
        'Сайт на Webflow зазвичай займає 2–4 тижні. Термін індивідуального JavaScript-застосунку залежить від обсягу робіт, і ми надаємо детальний графік до початку роботи.',
    },
    'self-update': {
      question: 'Чи можу я самостійно оновлювати сайт після запуску?',
      answer:
        'Звісно. Сайти на Webflow мають CMS, яку ви можете редагувати самі, а для індивідуальних проєктів ми можемо додати адмінпанель, щоб ваша команда залишалася незалежною.',
    },
    'post-launch-support': {
      question: 'Чи надаєте ви підтримку після запуску?',
      answer:
        'Так. Ми пропонуємо пакети постійної підтримки та обслуговування, що охоплюють оновлення, моніторинг і нові функції в міру росту вашого продукту.',
    },
  },
} satisfies Record<Locale, Record<FaqId, FaqCopy>>;

export function getFaq(locale: Locale): { sectionTitle: string; questions: IFaqItem[] } {
  return {
    ...faqSectionCopy[locale],
    questions: faqBase.map(({ id }) => ({ id, ...faqCopy[locale][id] })),
  };
}
