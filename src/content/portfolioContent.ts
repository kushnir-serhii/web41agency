import { StaticImageData } from 'next/image';
import {
  projectBuilding,
  projectCalmisuApp,
  projectCatoshi,
  projectInvest,
  projectLowCode,
  projectMarketing,
  projectNuance,
  projectPortfolioDesign,
  projectPortfolioDev,
  projectQa,
  projectReelReveal,
} from '../../public/images';

export interface IProjectMetric {
  value: string;
  label: string;
}

export interface IProject {
  /* Kebab-case and unique. Must match a slug in caseStudiesContent. The card links to /portfolio/<slug>. */
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

/* TODO(owner): review — every industry and summary below is a draft written from the title and tags.
   TODO(owner): real numbers — no card has a `metric` yet. Add one per project only when it is measured. */
export const portfolioContent: { sectionTitle: string; projects: IProject[] } = {
  sectionTitle: 'Portfolio',
  projects: [
    {
      slug: 'ai-movie-matching',
      image: projectReelReveal,
      title: 'AI Powered Movie Matching Web Application and Website',
      tags: ['Design', 'Development', 'OpenAI'],
      industry: 'Entertainment',
      summary: 'A web app that uses OpenAI to match people with films they will actually want to watch.',
    },
    {
      slug: 'calmisu',
      image: projectCalmisuApp,
      title: 'Calmisu App - Mindfulness Mobile Application',
      tags: ['Design', 'Mobile App', 'Expo', 'Chat AI'],
      industry: 'Health & Wellness',
      summary: 'A mindfulness mobile app built with Expo, with an AI chat companion at its core.',
    },
    {
      slug: 'catoshi',
      image: projectCatoshi,
      title: 'Catoshi - AI-powered Forecasting Crypto Dashboard',
      tags: ['Design', 'Development', 'AI', 'Dashboard', 'Landing Page'],
      industry: 'Fintech / Crypto',
      summary: 'A crypto dashboard that turns market data and news into probability-based forecasts.',
    },
    {
      slug: 'nuance',
      image: projectNuance,
      title: 'Nuance - AI Powered Web Application',
      tags: ['Design', 'Development', 'OpenAI'],
      industry: 'AI Software',
      summary: 'An AI-powered web application built on OpenAI, designed and developed end to end.',
    },
    {
      slug: 'qa-freelancer-website',
      image: projectQa,
      title: 'Website for QA Freelancer',
      tags: ['Design', 'Development', 'Portfolio'],
      industry: 'Software QA',
      summary: 'A portfolio website that presents a freelance QA engineer’s services and experience.',
    },
    {
      slug: 'full-stack-developer-portfolio',
      image: projectPortfolioDev,
      title: 'Full Stack Developer Portfolio Website',
      tags: ['Design', 'Development', 'Landing Page'],
      industry: 'Software Development',
      summary: 'A one-page portfolio that shows a full stack developer’s skills and projects at a glance.',
    },
    {
      slug: 'low-code-landing-page',
      image: projectLowCode,
      title: 'Low Code Mobile Development Landing Page',
      tags: ['Design', 'Low-Code', 'Landing Page'],
      industry: 'Mobile Development',
      summary: 'A landing page that explains a low-code mobile development offer and turns visitors into leads.',
    },
    {
      slug: 'construction-company-website',
      image: projectBuilding,
      title: 'Corporate Website for Construction Company',
      tags: ['Design', 'Development', 'Corporate Website'],
      industry: 'Construction',
      summary: 'A corporate website that presents a construction company’s services and completed work.',
    },
    {
      slug: 'saas-landing-page',
      image: projectInvest,
      title: 'Landing Page for Saas Platform',
      tags: ['Design', 'Dashboard', 'Landing Page'],
      industry: 'SaaS',
      summary: 'A landing page that shows off a SaaS platform’s dashboard and explains the product in seconds.',
    },
    {
      slug: 'digital-marketing-website',
      image: projectMarketing,
      title: 'Digital Marketing Website',
      tags: ['Design', 'Corporate Website', 'Marketing'],
      industry: 'Marketing',
      summary: 'A corporate website for a digital marketing agency, built to present its services clearly.',
    },
    {
      slug: 'designer-portfolio',
      image: projectPortfolioDesign,
      title: 'Designer’s Portfolio Website',
      tags: ['Design', 'Portfolio', 'Framer'],
      industry: 'Design',
      summary: 'A portfolio website in Framer that puts a designer’s work front and centre.',
    },
  ],
};
