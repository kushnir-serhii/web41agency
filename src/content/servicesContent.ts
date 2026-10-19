// Server-side accessors: call getServices / getServiceFeatures from server components
// and pass the result down as props (`server-only` is not installed, so not enforced).
import type { Locale } from '@/i18n/types';

const serviceBase = [
  { id: 'landing-page' },
  { id: 'js-development' },
  { id: 'low-code' },
  { id: 'api-integrations' },
  { id: 'ui-ux-design' },
  { id: 'branding' },
] as const;

export type ServiceId = (typeof serviceBase)[number]['id'];

interface ServiceCopy {
  title: string;
  description: string;
  timeline: string;
}

export interface IService extends ServiceCopy {
  id: ServiceId;
}

interface ServicesSectionCopy {
  sectionTitle: string;
}

const servicesSectionEn: ServicesSectionCopy = { sectionTitle: 'Services' };

const servicesEn = {
  'landing-page': {
    title: 'Landing page',
    description:
      'A focused one-page site that turns visitors into leads. Fast to launch, easy to update.',
    timeline: '3–7 days',
  },
  'js-development': {
    title: 'Custom web apps',
    description:
      'Websites and web apps built from scratch around your needs. Fast, scalable and ready to grow with your business.',
    // TODO(owner): confirm timeline
    timeline: '4–8 weeks, scope-dependent',
  },
  'low-code': {
    title: 'Webflow sites',
    description:
      'Fast, flexible sites on Webflow. A good fit when you need to launch quickly and want your team to manage the site without a developer.',
    timeline: '2–4 weeks',
  },
  'api-integrations': {
    title: 'Integrations and AI',
    description:
      'We connect your site or product to payments, CRMs and the data your business runs on, and add AI features with any provider: OpenAI, Anthropic, Google and others.',
    // TODO(owner): confirm timeline
    timeline: '1–3 weeks, scope-dependent',
  },
  'ui-ux-design': {
    title: 'Website and app design',
    description:
      'Interfaces designed around your users, from research and wireframes to a polished design system ready for development.',
    // TODO(owner): confirm timeline
    timeline: '2–4 weeks',
  },
  branding: {
    title: 'Branding',
    description:
      'Logos, visual identity and guidelines that keep your product recognisable everywhere it shows up.',
    // TODO(owner): confirm timeline
    timeline: '1–2 weeks',
  },
} satisfies Record<ServiceId, ServiceCopy>;

const servicesSectionCopy = {
  en: servicesSectionEn,
  uk: { sectionTitle: 'Послуги' },
} satisfies Record<Locale, ServicesSectionCopy>;

const servicesCopy = {
  en: servicesEn,
  uk: {
    'landing-page': {
      title: 'Лендінг',
      description:
        'Сфокусований односторінковий сайт, що перетворює відвідувачів на клієнтів. Швидко запускається і легко оновлюється.',
      timeline: '3–7 днів',
    },
    'js-development': {
      title: 'Індивідуальні вебзастосунки',
      description:
        'Сайти та вебзастосунки, створені з нуля під ваші задачі. Швидкі, масштабовані й готові рости разом із вашим бізнесом.',
      // TODO(owner): confirm timeline
      timeline: '4–8 тижнів, залежно від обсягу',
    },
    'low-code': {
      title: 'Сайти на Webflow',
      description:
        'Швидкі та гнучкі сайти на Webflow. Добрий вибір, коли потрібно швидко запуститися і щоб команда керувала сайтом без розробника.',
      timeline: '2–4 тижні',
    },
    'api-integrations': {
      title: 'Інтеграції та AI',
      description:
        'Підключаємо ваш сайт чи продукт до платежів, CRM і даних, на яких працює ваш бізнес, та додаємо AI-функції з будь-яким провайдером: OpenAI, Anthropic, Google та іншими.',
      // TODO(owner): confirm timeline
      timeline: '1–3 тижні, залежно від обсягу',
    },
    'ui-ux-design': {
      title: 'Дизайн сайтів і застосунків',
      description:
        'Інтерфейси, створені навколо ваших користувачів: від досліджень і вайрфреймів до продуманої дизайн-системи, готової до розробки.',
      // TODO(owner): confirm timeline
      timeline: '2–4 тижні',
    },
    branding: {
      title: 'Брендинг',
      description:
        'Логотипи, візуальна айдентика та гайдлайни, завдяки яким ваш продукт залишається впізнаваним скрізь.',
      // TODO(owner): confirm timeline
      timeline: '1–2 тижні',
    },
  },
} satisfies Record<Locale, Record<ServiceId, ServiceCopy>>;

export function getServices(locale: Locale): { sectionTitle: string; services: IService[] } {
  return {
    ...servicesSectionCopy[locale],
    services: serviceBase.map(({ id }) => ({ id, ...servicesCopy[locale][id] })),
  };
}

const serviceFeatureBase = [
  { id: 'custom-design', iconPath: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' },
  {
    id: 'domain-hosting',
    iconPath:
      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  },
  { id: 'free-hosting', iconPath: 'M3 7h18v4H3ZM3 13h18v4H3ZM7 9h.01M7 15h.01' },
  {
    id: 'responsive-design',
    iconPath: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM11 18h2',
  },
  {
    id: 'content-filling',
    iconPath: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8ZM14 3v5h5M9 13h6M9 17h6',
  },
  { id: 'google-indexing', iconPath: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35' },
  {
    id: 'free-ssl',
    iconPath:
      'M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM8 11V7a4 4 0 0 1 8 0v4',
  },
  {
    id: 'video-walkthrough',
    iconPath:
      'M3 6h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM16 10l6-3v10l-6-3',
  },
] as const;

export type ServiceFeatureId = (typeof serviceFeatureBase)[number]['id'];

interface ServiceFeatureCopy {
  title: string;
  description: string;
}

export interface IServiceFeature extends ServiceFeatureCopy {
  id: ServiceFeatureId;
  /* SVG path data (24x24 viewBox, stroke icon) */
  iconPath: string;
}

const serviceFeaturesEn = {
  'custom-design': {
    title: 'Custom design',
    description: 'Every site gets a unique design made for your brand. No templates.',
  },
  'domain-hosting': {
    title: 'Domain & hosting setup',
    description: 'We register or connect your domain and set up hosting for you.',
  },
  'free-hosting': {
    title: 'Free hosting',
    description: 'Static sites are hosted for free, with no monthly hosting fees.',
  },
  'responsive-design': {
    title: 'Responsive design',
    description: 'Your site looks and works great on phones, tablets and desktops.',
  },
  'content-filling': {
    title: 'Content filling',
    description:
      'We write short texts, headings and key info, and source images and icons for the visuals.',
  },
  'google-indexing': {
    title: 'Google indexing',
    description:
      'Google Search Console, sitemap.xml and robots.txt set up so your site appears in search. SEO promotion is not included.',
  },
  'free-ssl': {
    title: 'Free SSL certificate',
    description: 'A secure HTTPS connection is included.',
  },
  'video-walkthrough': {
    title: 'Video walkthrough',
    description: 'A short recorded guide on managing your site and handling incoming leads.',
  },
} satisfies Record<ServiceFeatureId, ServiceFeatureCopy>;

const serviceFeaturesSectionCopy = {
  en: { title: 'Every landing page includes' },
  uk: { title: 'У кожен лендінг входить' },
} satisfies Record<Locale, { title: string }>;

const serviceFeaturesCopy = {
  en: serviceFeaturesEn,
  uk: {
    'custom-design': {
      title: 'Індивідуальний дизайн',
      description:
        'Кожен сайт отримує унікальний дизайн, створений для вашого бренду. Жодних шаблонів.',
    },
    'domain-hosting': {
      title: 'Налаштування домену та хостингу',
      description: 'Реєструємо або підключаємо ваш домен і налаштовуємо хостинг за вас.',
    },
    'free-hosting': {
      title: 'Безкоштовний хостинг',
      description: 'Статичні сайти розміщуємо безкоштовно, без щомісячної плати за хостинг.',
    },
    'responsive-design': {
      title: 'Адаптивний дизайн',
      description: 'Ваш сайт чудово виглядає і працює на телефонах, планшетах та комп’ютерах.',
    },
    'content-filling': {
      title: 'Наповнення контентом',
      description:
        'Пишемо короткі тексти, заголовки та ключову інформацію, а також підбираємо зображення та іконки для візуальної частини.',
    },
    'google-indexing': {
      title: 'Індексація в Google',
      description:
        'Налаштовуємо Google Search Console, sitemap.xml і robots.txt, щоб ваш сайт з’являвся в пошуку. SEO-просування не входить.',
    },
    'free-ssl': {
      title: 'Безкоштовний SSL-сертифікат',
      description: 'Безпечне HTTPS-з’єднання вже включено.',
    },
    'video-walkthrough': {
      title: 'Відеоінструкція',
      description: 'Коротке відео про те, як керувати сайтом і обробляти вхідні заявки.',
    },
  },
} satisfies Record<Locale, Record<ServiceFeatureId, ServiceFeatureCopy>>;

export function getServiceFeatures(locale: Locale): {
  title: string;
  features: IServiceFeature[];
} {
  return {
    ...serviceFeaturesSectionCopy[locale],
    features: serviceFeatureBase.map((base) => ({
      ...base,
      ...serviceFeaturesCopy[locale][base.id],
    })),
  };
}
