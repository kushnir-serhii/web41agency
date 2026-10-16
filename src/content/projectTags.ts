/* Text-only labels for the tags shown on portfolio cards and case study heroes. */
import type { Locale } from '@/i18n/types';

export const projectTagIds = [
  'design',
  'development',
  'openai',
  'mobile-app',
  'expo',
  'chat-ai',
  'ai',
  'dashboard',
  'landing-page',
  'e-commerce',
  'real-time',
  'game',
  'portfolio',
  'low-code',
  'corporate-website',
  'marketing',
  'framer',
] as const;

export type ProjectTagId = (typeof projectTagIds)[number];

const projectTagLabels = {
  en: {
    design: 'Design',
    development: 'Development',
    openai: 'OpenAI',
    'mobile-app': 'Mobile App',
    expo: 'Expo',
    'chat-ai': 'Chat AI',
    ai: 'AI',
    dashboard: 'Dashboard',
    'landing-page': 'Landing Page',
    'e-commerce': 'E-commerce',
    'real-time': 'Real-Time',
    game: 'Game',
    portfolio: 'Portfolio',
    'low-code': 'Low-Code',
    'corporate-website': 'Corporate Website',
    marketing: 'Marketing',
    framer: 'Framer',
  },
  uk: {
    design: 'Дизайн',
    development: 'Розробка',
    openai: 'OpenAI',
    'mobile-app': 'Мобільний застосунок',
    expo: 'Expo',
    'chat-ai': 'AI-чат',
    ai: 'AI',
    dashboard: 'Дашборд',
    'landing-page': 'Лендінг',
    'e-commerce': 'Інтернет-магазин',
    'real-time': 'Реальний час',
    game: 'Гра',
    portfolio: 'Портфоліо',
    'low-code': 'Low-Code',
    'corporate-website': 'Корпоративний сайт',
    marketing: 'Маркетинг',
    framer: 'Framer',
  },
} satisfies Record<Locale, Record<ProjectTagId, string>>;

export function getTagLabels(tags: readonly ProjectTagId[], locale: Locale): string[] {
  return tags.map((tag) => projectTagLabels[locale][tag]);
}
