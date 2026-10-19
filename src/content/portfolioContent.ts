// Server-side accessor: call getPortfolio from server components and pass the result down as props.
import { StaticImageData } from 'next/image';

import type { Locale } from '@/i18n/types';

import {
  projectBuilding,
  projectCalmisuApp,
  projectCatoshi,
  projectInvest,
  projectLowCode,
  projectMarketing,
  projectMemeAcademy,
  projectMeridian,
  projectNuance,
  projectPortfolioDesign,
  projectPortfolioDev,
  projectQa,
  projectReelReveal,
} from '../../public/images';
import { type CaseStudySlug, caseStudySlugs } from './caseStudyTitles';
import { getTagLabels, type ProjectTagId } from './projectTags';

export interface IProjectMetric {
  value: string;
  label: string;
}

export interface IProject {
  /* Kebab-case and unique. Must match a slug in caseStudyTitles. The card links to /portfolio/<slug>. */
  slug: string;
  image: StaticImageData;
  title: string;
  tags: string[];
  /* Small muted label above the card title. */
  industry: string;
  /* One or two lines under the card title. The card clamps it to 2 lines. */
  summary: string;
  /* Optional lime chip on the card. Only real, measured numbers. */
  metric?: IProjectMetric;
}

interface ProjectBase {
  image: StaticImageData;
  tags: readonly ProjectTagId[];
}

interface ProjectCopy {
  /* Long title, also used as the case study cardTitle. */
  title: string;
  industry: string;
  summary: string;
}

const projectBase = {
  'ai-movie-matching': { image: projectReelReveal, tags: ['design', 'development', 'openai'] },
  calmisu: { image: projectCalmisuApp, tags: ['design', 'mobile-app', 'expo', 'chat-ai'] },
  catoshi: {
    image: projectCatoshi,
    tags: ['design', 'development', 'ai', 'dashboard', 'landing-page'],
  },
  nuance: { image: projectNuance, tags: ['design', 'development', 'openai'] },
  'meridian-coffee-shop': {
    image: projectMeridian,
    tags: ['design', 'development', 'e-commerce'],
  },
  'meme-academy': {
    image: projectMemeAcademy,
    tags: ['design', 'development', 'real-time', 'game'],
  },
  investico: { image: projectInvest, tags: ['design', 'development', 'openai', 'dashboard'] },
  'qa-freelancer-website': { image: projectQa, tags: ['design', 'development', 'portfolio'] },
  'full-stack-developer-portfolio': {
    image: projectPortfolioDev,
    tags: ['design', 'development', 'landing-page'],
  },
  'low-code-landing-page': {
    image: projectLowCode,
    tags: ['design', 'low-code', 'landing-page'],
  },
  'construction-company-website': {
    image: projectBuilding,
    tags: ['design', 'development', 'corporate-website'],
  },
  'digital-marketing-website': {
    image: projectMarketing,
    tags: ['design', 'corporate-website', 'marketing'],
  },
  'designer-portfolio': { image: projectPortfolioDesign, tags: ['design', 'portfolio', 'framer'] },
} satisfies Record<CaseStudySlug, ProjectBase>;

const portfolioSectionCopy = {
  en: { sectionTitle: 'Portfolio' },
  uk: { sectionTitle: 'Портфоліо' },
} satisfies Record<Locale, { sectionTitle: string }>;

/* Industry and summary are grounded in each case study. Do not claim client results here.
   TODO(owner): real numbers — no card has a `metric` yet. Add one per project only when it is measured. */
const projectCopy = {
  en: {
    'ai-movie-matching': {
      title: 'AI Powered Movie Matching Web Application and Website',
      industry: 'Entertainment',
      summary:
        'A short quiz and OpenAI pick films people will actually want to watch. No endless scrolling.',
    },
    calmisu: {
      title: 'Calmisu App - Mindfulness Mobile Application',
      industry: 'Mental Wellness',
      summary:
        'A mindfulness app with an AI chat companion that helps people check in with themselves daily.',
    },
    catoshi: {
      title: 'Catoshi - AI-powered Forecasting Crypto Dashboard',
      industry: 'Crypto / Fintech',
      summary:
        'Turns market data and news into probability-based forecasts, ready before you open the dashboard.',
    },
    nuance: {
      title: 'Nuance - AI Powered Web Application',
      industry: 'EdTech',
      summary:
        'Helps non-native English speakers handle workplace conversations, with instant AI feedback.',
    },
    'meridian-coffee-shop': {
      title: 'Meridian - Online Shop for a Coffee Brand',
      industry: 'E-commerce',
      summary:
        'A coffee brand’s online shop with subscriptions, one cart and a three-step checkout.',
    },
    'meme-academy': {
      title: 'Meme Academy - Real-Time Multiplayer Party Game',
      industry: 'Gaming',
      summary:
        'A real-time party game: friends join by link, match meme cards to prompts and take turns judging.',
    },
    investico: {
      title: 'Investico - Investor and Startup Matching Platform',
      industry: 'Venture Capital',
      summary:
        'Startups and investors find each other, with AI matching that cuts down on cold outreach.',
    },
    'qa-freelancer-website': {
      title: 'Website for QA Freelancer',
      industry: 'Software Testing',
      summary:
        'A QA engineer’s site that lays out services and past work, and makes getting in touch easy.',
    },
    'full-stack-developer-portfolio': {
      title: 'Full Stack Developer Portfolio Website',
      industry: 'Software Development',
      summary:
        'A one-page developer portfolio that shows skills and projects as proof. Reads in under a minute.',
    },
    'low-code-landing-page': {
      title: 'Low Code Mobile Development Landing Page',
      industry: 'Mobile Development',
      summary:
        'Explains a low-code offer in plain language. The team edits the page without a developer.',
    },
    'construction-company-website': {
      title: 'Corporate Website for Construction Company',
      industry: 'Construction',
      summary: 'Puts a builder’s completed projects up front, with a quote request one click away.',
    },
    'digital-marketing-website': {
      title: 'Digital Marketing Website',
      industry: 'Marketing Agency',
      summary:
        'Website design for a marketing agency, with a confident style and services that are easy to scan.',
    },
    'designer-portfolio': {
      title: 'Designer’s Portfolio Website',
      industry: 'Design',
      summary:
        'A Framer portfolio where the work leads, and the designer adds new projects without a developer.',
    },
  },
  uk: {
    'ai-movie-matching': {
      title: 'Вебзастосунок і сайт для підбору фільмів на основі AI',
      industry: 'Розваги',
      summary:
        'Короткий квіз і OpenAI підбирають фільми, які справді захочеться подивитися. Без нескінченного гортання.',
    },
    calmisu: {
      title: 'Calmisu — мобільний застосунок для усвідомленості',
      industry: 'Ментальне здоров’я',
      summary:
        'Застосунок для усвідомленості з AI-співрозмовником, який допомагає щодня прислухатися до себе.',
    },
    catoshi: {
      title: 'Catoshi — криптодашборд із прогнозами на основі AI',
      industry: 'Крипто / Фінтех',
      summary:
        'Перетворює ринкові дані й новини на ймовірнісні прогнози, готові ще до того, як ви відкриєте дашборд.',
    },
    nuance: {
      title: 'Nuance — вебзастосунок на основі AI',
      industry: 'EdTech',
      summary:
        'Допомагає тим, для кого англійська не рідна, впевнено спілкуватися на роботі, з миттєвим AI-фідбеком.',
    },
    'meridian-coffee-shop': {
      title: 'Meridian — інтернет-магазин кавового бренду',
      industry: 'Електронна комерція',
      summary:
        'Інтернет-магазин кавового бренду з підписками, єдиним кошиком і оформленням у три кроки.',
    },
    'meme-academy': {
      title: 'Meme Academy — мультиплеєрна гра для компанії в реальному часі',
      industry: 'Ігри',
      summary:
        'Гра для компанії в реальному часі: друзі заходять за посиланням, підбирають мем-картки й по черзі суддять.',
    },
    investico: {
      title: 'Investico — платформа для пошуку інвесторів і стартапів',
      industry: 'Венчурні інвестиції',
      summary:
        'Стартапи й інвестори знаходять одне одного, а AI-підбір зменшує кількість холодних листів.',
    },
    'qa-freelancer-website': {
      title: 'Сайт для QA-фрилансера',
      industry: 'Тестування ПЗ',
      summary: 'Сайт QA-інженера, що показує послуги й попередні роботи та спрощує зв’язок.',
    },
    'full-stack-developer-portfolio': {
      title: 'Сайт-портфоліо full stack розробника',
      industry: 'Розробка ПЗ',
      summary:
        'Односторінкове портфоліо розробника, де навички й проєкти — це докази. Читається менш ніж за хвилину.',
    },
    'low-code-landing-page': {
      title: 'Лендінг для low-code мобільної розробки',
      industry: 'Мобільна розробка',
      summary:
        'Простою мовою пояснює low-code пропозицію. Команда редагує сторінку без розробника.',
    },
    'construction-company-website': {
      title: 'Корпоративний сайт будівельної компанії',
      industry: 'Будівництво',
      summary:
        'Виводить завершені об’єкти будівельної компанії на перший план, а запит на кошторис — за один клік.',
    },
    'digital-marketing-website': {
      title: 'Сайт агенції цифрового маркетингу',
      industry: 'Маркетингова агенція',
      summary:
        'Дизайн сайту маркетингової агенції: впевнений стиль і послуги, які легко переглянути.',
    },
    'designer-portfolio': {
      title: 'Сайт-портфоліо дизайнера',
      industry: 'Дизайн',
      summary:
        'Портфоліо на Framer, де головне — роботи, а дизайнер сам додає нові проєкти без розробника.',
    },
  },
} satisfies Record<Locale, Record<CaseStudySlug, ProjectCopy>>;

/* Long title, industry and tag labels, shared with the case study page so they are written once. */
export function getProjectLabels(
  slug: CaseStudySlug,
  locale: Locale,
): { title: string; industry: string; tags: string[] } {
  const { title, industry } = projectCopy[locale][slug];
  return { title, industry, tags: getTagLabels(projectBase[slug].tags, locale) };
}

export function getPortfolio(locale: Locale): { sectionTitle: string; projects: IProject[] } {
  return {
    ...portfolioSectionCopy[locale],
    projects: caseStudySlugs.map((slug) => ({
      slug,
      image: projectBase[slug].image,
      ...projectCopy[locale][slug],
      tags: getTagLabels(projectBase[slug].tags, locale),
    })),
  };
}
