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

/* TODO(owner): review — every industry and summary below is a draft written from the title and tags.
   TODO(owner): real numbers — no card has a `metric` yet. Add one per project only when it is measured. */
const projectCopy = {
  en: {
    'ai-movie-matching': {
      title: 'AI Powered Movie Matching Web Application and Website',
      industry: 'Entertainment',
      summary:
        'A web app that uses OpenAI to match people with films they will actually want to watch.',
    },
    calmisu: {
      title: 'Calmisu App - Mindfulness Mobile Application',
      industry: 'Health & Wellness',
      summary: 'A mindfulness mobile app built with Expo, with an AI chat companion at its core.',
    },
    catoshi: {
      title: 'Catoshi - AI-powered Forecasting Crypto Dashboard',
      industry: 'Fintech / Crypto',
      summary:
        'A crypto dashboard that turns market data and news into probability-based forecasts.',
    },
    nuance: {
      title: 'Nuance - AI Powered Web Application',
      industry: 'AI Software',
      summary: 'An AI-powered web application built on OpenAI, designed and developed end to end.',
    },
    'meridian-coffee-shop': {
      title: 'Meridian - Online Shop for a Coffee Brand',
      industry: 'E-commerce',
      summary:
        'An online shop for a coffee brand, with subscriptions, one cart and a three-step checkout.',
    },
    'meme-academy': {
      title: 'Meme Academy - Real-Time Multiplayer Party Game',
      industry: 'Entertainment',
      summary:
        'A browser party game where friends join a room by link and battle with meme cards in real time.',
    },
    investico: {
      title: 'Investico - Investor and Startup Matching Platform',
      industry: 'Venture / SaaS',
      summary:
        'A multilingual platform that matches startups with investors, with AI-assisted discovery.',
    },
    'qa-freelancer-website': {
      title: 'Website for QA Freelancer',
      industry: 'Software QA',
      summary:
        'A portfolio website that presents a freelance QA engineer’s services and experience.',
    },
    'full-stack-developer-portfolio': {
      title: 'Full Stack Developer Portfolio Website',
      industry: 'Software Development',
      summary:
        'A one-page portfolio that shows a full stack developer’s skills and projects at a glance.',
    },
    'low-code-landing-page': {
      title: 'Low Code Mobile Development Landing Page',
      industry: 'Mobile Development',
      summary:
        'A landing page that explains a low-code mobile development offer and turns visitors into leads.',
    },
    'construction-company-website': {
      title: 'Corporate Website for Construction Company',
      industry: 'Construction',
      summary:
        'A corporate website that presents a construction company’s services and completed work.',
    },
    'digital-marketing-website': {
      title: 'Digital Marketing Website',
      industry: 'Marketing',
      summary:
        'A corporate website for a digital marketing agency, built to present its services clearly.',
    },
    'designer-portfolio': {
      title: 'Designer’s Portfolio Website',
      industry: 'Design',
      summary: 'A portfolio website in Framer that puts a designer’s work front and centre.',
    },
  },
  uk: {
    'ai-movie-matching': {
      title: 'Вебзастосунок і сайт для підбору фільмів на основі AI',
      industry: 'Розваги',
      summary:
        'Вебзастосунок, який за допомогою OpenAI підбирає фільми, що людям справді захочеться подивитися.',
    },
    calmisu: {
      title: 'Calmisu — мобільний застосунок для усвідомленості',
      industry: 'Здоров’я та добробут',
      summary: 'Мобільний застосунок для усвідомленості на Expo з AI-співрозмовником в основі.',
    },
    catoshi: {
      title: 'Catoshi — криптодашборд із прогнозами на основі AI',
      industry: 'Фінтех / Крипто',
      summary: 'Криптодашборд, який перетворює ринкові дані та новини на прогнози з ймовірностями.',
    },
    nuance: {
      title: 'Nuance — вебзастосунок на основі AI',
      industry: 'AI-програми',
      summary: 'Вебзастосунок на основі OpenAI, який ми спроєктували та розробили від і до.',
    },
    'meridian-coffee-shop': {
      title: 'Meridian — інтернет-магазин кавового бренду',
      industry: 'Електронна комерція',
      summary:
        'Інтернет-магазин кавового бренду з підписками, єдиним кошиком і оформленням замовлення у три кроки.',
    },
    'meme-academy': {
      title: 'Meme Academy — мультиплеєрна гра для компанії в реальному часі',
      industry: 'Розваги',
      summary:
        'Браузерна гра для компанії: друзі заходять у кімнату за посиланням і змагаються мем-картками в реальному часі.',
    },
    investico: {
      title: 'Investico — платформа для пошуку інвесторів і стартапів',
      industry: 'Венчур / SaaS',
      summary:
        'Багатомовна платформа, яка поєднує стартапи з інвесторами та допомагає з пошуком за допомогою AI.',
    },
    'qa-freelancer-website': {
      title: 'Сайт для QA-фрилансера',
      industry: 'Тестування ПЗ',
      summary: 'Сайт-портфоліо, що представляє послуги та досвід QA-інженера на фрилансі.',
    },
    'full-stack-developer-portfolio': {
      title: 'Сайт-портфоліо full stack розробника',
      industry: 'Розробка ПЗ',
      summary:
        'Односторінкове портфоліо, яке з першого погляду показує навички та проєкти full stack розробника.',
    },
    'low-code-landing-page': {
      title: 'Лендінг для low-code мобільної розробки',
      industry: 'Мобільна розробка',
      summary:
        'Лендінг, який пояснює пропозицію low-code мобільної розробки та перетворює відвідувачів на заявки.',
    },
    'construction-company-website': {
      title: 'Корпоративний сайт будівельної компанії',
      industry: 'Будівництво',
      summary:
        'Корпоративний сайт, що представляє послуги та завершені об’єкти будівельної компанії.',
    },
    'digital-marketing-website': {
      title: 'Сайт агенції цифрового маркетингу',
      industry: 'Маркетинг',
      summary:
        'Корпоративний сайт агенції цифрового маркетингу, створений, щоб чітко представити її послуги.',
    },
    'designer-portfolio': {
      title: 'Сайт-портфоліо дизайнера',
      industry: 'Дизайн',
      summary: 'Сайт-портфоліо на Framer, який ставить роботи дизайнера в центр уваги.',
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
