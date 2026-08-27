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

export interface IProject {
  image: StaticImageData;
  title: string;
  tags: string[];
  href: string;
}

export const portfolioContent: { sectionTitle: string; projects: IProject[] } = {
  sectionTitle: 'Portfolio',
  projects: [
    {
      image: projectReelReveal,
      title: 'AI Powered Movie Matching Web Application and Website',
      tags: ['Design', 'Development', 'OpenAI'],
      href: '/portfolio',
    },
    {
      image: projectCalmisuApp,
      title: 'Calmisu App - Mindfulness Mobile Application',
      tags: ['Design', 'Mobile App', 'Expo', 'Chat AI'],
      href: '/portfolio',
    },
    {
      image: projectCatoshi,
      title: 'Catoshi - AI-powered Forecasting Crypto Dashboard',
      tags: ['Design', 'Development', 'AI', 'Dashboard', 'Landing Page'],
      href: '/portfolio',
    },
    {
      image: projectNuance,
      title: 'Nuance - AI Powered Web Application',
      tags: ['Design', 'Development', 'OpenAI'],
      href: '/portfolio',
    },
    {
      image: projectQa,
      title: 'Website for QA Freelancer',
      tags: ['Design', 'Development', 'Portfolio'],
      href: '/portfolio',
    },
    {
      image: projectPortfolioDev,
      title: 'Full Stack Developer Portfolio Website',
      tags: ['Design', 'Development', 'Landing Page'],
      href: '/portfolio',
    },
    {
      image: projectLowCode,
      title: 'Low Code Mobile Development Landing Page',
      tags: ['Design', 'Low-Code', 'Landing Page'],
      href: '/portfolio',
    },
    {
      image: projectBuilding,
      title: 'Corporate Website for Construction Company',
      tags: ['Design', 'Development', 'Corporate Website'],
      href: '/portfolio',
    },
    {
      image: projectInvest,
      title: 'Landing Page for Saas Platform',
      tags: ['Design', 'Dashboard', 'Landing Page'],
      href: '/portfolio',
    },
    {
      image: projectMarketing,
      title: 'Digital Marketing Website',
      tags: ['Design', 'Corporate Website', 'Marketing'],
      href: '/portfolio',
    },
    {
      image: projectPortfolioDesign,
      title: 'Designer’s Portfolio Website',
      tags: ['Design', 'Portfolio', 'Framer'],
      href: '/portfolio',
    },
  ],
};
