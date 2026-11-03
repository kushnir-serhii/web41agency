// Server-side accessor: call getFaq from server components and pass the result down
// as props (`server-only` is not installed, so not enforced).
import type { Locale } from '@/i18n/types';

const faqBase = [
  { id: 'low-vs-pure-code' },
  { id: 'which-solution' },
  { id: 'design-services' },
  { id: 'build-time' },
  { id: 'self-update' },
  { id: 'seo-setup' },
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
    question: 'Webflow site or custom web app: what’s the difference?',
    answer:
      'A Webflow site is quick to launch and easy for your team to edit, so it suits most business sites. A custom web app is built from scratch with Next.js and TypeScript, and suits products with complex features and full control.',
  },
  'which-solution': {
    question: 'How do I know which solution is right for me?',
    answer:
      'We start with a free consultation: we look at your goals, timeline and budget, then recommend the approach that gets you there fastest without boxing you in later.',
  },
  'design-services': {
    question: 'Do you offer design services as well?',
    answer:
      'Yes. We cover the full process: research, UX, UI and brand identity. We either hand off a design system your developers can build on, or build it ourselves.',
  },
  'build-time': {
    question: 'How long does it take to build a website?',
    answer:
      'A landing page takes 3–7 days. Larger sites and custom web apps depend on scope, and we give you a detailed timeline before any work starts.',
  },
  'self-update': {
    question: 'Can I update my website myself after launch?',
    answer:
      'Yes. Webflow sites come with an editor you can use yourself, and for custom builds we can add an admin panel, so your team stays independent.',
  },
  'seo-setup': {
    question: 'Is SEO included?',
    answer:
      'Every site launches with technical SEO set up: page titles and descriptions, social sharing previews, a sitemap and robots.txt, structured data, clean URLs and fast mobile loading. Ongoing SEO work such as content writing, link building or ranking guarantees is not included and is quoted separately.',
  },
  'post-launch-support': {
    question: 'Do you offer post-launch support?',
    answer:
      'Yes. For 30 days after launch we fix, free of charge: bugs in what we built (broken layouts, forms, links or logic that does not match the agreed scope), display issues in current Chrome, Safari, Firefox and Edge on desktop, iOS and Android, and problems with the hosting or deployment we set up. Not included: new pages or features, design changes after approval, issues caused by edits from you or third parties, and outages or price changes of third-party services. After 30 days, support and new work are quoted separately.',
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
      question: 'Сайт на Webflow чи індивідуальний вебзастосунок: у чому різниця?',
      answer:
        'Сайт на Webflow швидко запускається, і вашій команді легко його редагувати, тому він підходить для більшості бізнес-сайтів. Індивідуальний вебзастосунок пишеться з нуля на Next.js і TypeScript та підходить для продуктів зі складним функціоналом і повним контролем.',
    },
    'which-solution': {
      question: 'Як зрозуміти, яке рішення мені підходить?',
      answer:
        'Ми починаємо з безкоштовної консультації: вивчаємо ваші цілі, терміни та бюджет, а потім рекомендуємо підхід, який приведе вас до результату найшвидше й не обмежить надалі.',
    },
    'design-services': {
      question: 'Ви також надаєте послуги з дизайну?',
      answer:
        'Так. Ми охоплюємо весь процес: дослідження, UX, UI та айдентику бренду. Передаємо дизайн-систему, на основі якої ваші розробники можуть працювати далі, або реалізуємо її самі.',
    },
    'build-time': {
      question: 'Скільки часу займає створення сайту?',
      answer:
        'Лендінг займає 3–7 днів. Терміни більших сайтів і вебзастосунків залежать від обсягу робіт, а детальний графік ми надаємо до початку роботи.',
    },
    'self-update': {
      question: 'Чи можу я самостійно оновлювати сайт після запуску?',
      answer:
        'Так. Сайти на Webflow мають редактор, яким ви можете користуватися самі, а для індивідуальних проєктів ми можемо додати адмінпанель, щоб ваша команда залишалася незалежною.',
    },
    'seo-setup': {
      question: 'Чи входить SEO у вартість?',
      answer:
        'Кожен сайт запускається з налаштованим технічним SEO: заголовки й описи сторінок, прев’ю для соцмереж, sitemap і robots.txt, структуровані дані, зрозумілі URL та швидке завантаження на мобільних. Постійна робота з SEO, як-от написання контенту, нарощування посилань чи гарантії позицій, не входить і оцінюється окремо.',
    },
    'post-launch-support': {
      question: 'Чи надаєте ви підтримку після запуску?',
      answer:
        'Так. Протягом 30 днів після запуску ми безкоштовно виправляємо: помилки в тому, що ми створили (зламана верстка, форми, посилання чи логіка, що не відповідає погодженому обсягу), проблеми відображення в актуальних Chrome, Safari, Firefox і Edge на комп’ютері, iOS та Android, а також проблеми з хостингом чи деплоєм, які ми налаштували. Не входить: нові сторінки чи функції, зміни дизайну після погодження, проблеми через правки з вашого боку чи третіх осіб, збої або зміна цін сторонніх сервісів. Після 30 днів підтримка й нові роботи оцінюються окремо.',
    },
  },
} satisfies Record<Locale, Record<FaqId, FaqCopy>>;

export function getFaq(locale: Locale): { sectionTitle: string; questions: IFaqItem[] } {
  return {
    ...faqSectionCopy[locale],
    questions: faqBase.map(({ id }) => ({ id, ...faqCopy[locale][id] })),
  };
}
