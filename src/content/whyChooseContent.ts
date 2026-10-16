// Server-side accessor: call getWhyChoose from server components and pass the result
// down as props (`server-only` is not installed, so not enforced).
import type { IWhyChooseContent } from '@/components/whyChoose/WhyChoose';
import { CONSULTATION_HREF } from '@/content/ctaLinks';
import { formatUsd, PRICING_TIERS } from '@/content/pricing';
import type { Locale } from '@/i18n/types';

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
  textButton: string;
}

/** Builds the price sentence from PRICING_TIERS (USD-only) with localized glue words. */
const pricingSegments = (words: {
  intro: string;
  and: string;
  from: string;
  tierLabels: Record<(typeof PRICING_TIERS)[number]['key'], string>;
}): Segment[] => [
  { text: words.intro, highlight: false },
  ...PRICING_TIERS.flatMap((tier, index) => [
    {
      text: index === 0 ? '' : index === PRICING_TIERS.length - 1 ? words.and : ', ',
      highlight: false,
    },
    { text: words.tierLabels[tier.key] + ' ', highlight: true },
    { text: words.from, highlight: false },
    { text: formatUsd(tier.usd), highlight: true },
  ]).filter((segment) => segment.text !== ''),
  { text: '.', highlight: false },
];

const whyChooseSectionEn: WhyChooseSectionCopy = {
  sectionTitle: 'Why Choose Us',
  textButton: 'Free Consultation',
};

const whyChooseEn = {
  fast: {
    title: 'Fast & Efficient',
    description: [
      { text: 'Get your website up and running quickly—Webflow sites in ', highlight: false },
      { text: '2–4 weeks,', highlight: true },
      {
        text: ' and custom JavaScript solutions optimized for high performance.',
        highlight: false,
      },
    ],
  },
  cost: {
    title: 'Cost-Effective',
    description: pricingSegments({
      intro: 'We tailor our pricing to fit your needs: ',
      and: ' and ',
      from: 'from ',
      tierLabels: { landing: 'Landing Page', lowCode: 'Low Code', custom: 'Custom' },
    }),
  },
  flex: {
    title: 'Scalable & Flexible',
    description: [
      {
        text: 'Whether you need a fully custom-coded platform or an easy-to-manage Webflow site, ',
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
    textButton: 'Безкоштовна оцінка',
  },
} satisfies Record<Locale, WhyChooseSectionCopy>;

const whyChooseCopy = {
  en: whyChooseEn,
  uk: {
    fast: {
      title: 'Швидко та ефективно',
      description: [
        { text: 'Запустіть сайт швидко — сайти на Webflow за ', highlight: false },
        { text: '2–4 тижні,', highlight: true },
        {
          text: ' а індивідуальні JavaScript-рішення оптимізовані для високої продуктивності.',
          highlight: false,
        },
      ],
    },
    cost: {
      title: 'Вигідно',
      description: pricingSegments({
        intro: 'Ми підбираємо ціну під ваші потреби: ',
        and: ' та ',
        from: 'від ',
        tierLabels: { landing: 'Лендінг', lowCode: 'Low Code', custom: 'Індивідуальна розробка' },
      }),
    },
    flex: {
      title: 'Масштабовано та гнучко',
      description: [
        {
          text: 'Незалежно від того, чи потрібна вам повністю індивідуальна платформа, чи простий у керуванні сайт на Webflow, ',
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
