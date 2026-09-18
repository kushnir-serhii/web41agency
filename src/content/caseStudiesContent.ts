import { StaticImageData } from 'next/image';
import {
  heroCatoshiMobile,
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

export interface ICaseFact {
  label: string;
  value: string;
}

export interface ICaseBlock {
  /* Rendered as the section heading on the case page. */
  heading: string;
  /* One paragraph per array item. */
  paragraphs: string[];
  /* Optional bullet list under the paragraphs. */
  bullets?: string[];
}

export interface ICaseImage {
  src: StaticImageData;
  alt: string;
  /* A one-line caption under the image. Optional. */
  caption?: string;
}

export interface ICaseStudy {
  slug: string;
  /* Short title used in the hero, breadcrumb and "next project" link. */
  title: string;
  /* Long title used for <title> and the portfolio card. */
  cardTitle: string;
  /* Small label above the hero title, e.g. "Construction". */
  industry: string;
  summary: string;
  cover: ICaseImage;
  tags: string[];
  facts: ICaseFact[];
  blocks: ICaseBlock[];
  /* Measured outcomes, shown as big numbers. The section is hidden while this is empty. */
  results?: ICaseFact[];
  /* The section is hidden while this is empty. */
  stack: string[];
  gallery?: ICaseImage[];
  /* Live URL, when the project is public. Omitted while it is not. */
  liveUrl?: string;
}

/* Same order as the portfolio cards, so "Next project" follows the grid. */
export const caseStudies: ICaseStudy[] = [
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared.
     The cover asset is named "reel-reveal": confirm the product name before using it here. */
  {
    slug: 'ai-movie-matching',
    title: 'AI Movie Matching App',
    cardTitle: 'AI Powered Movie Matching Web Application and Website',
    industry: 'Entertainment',
    summary:
      'A web application and marketing website that use OpenAI to match people with films they will actually want to watch, instead of another endless scroll through a catalogue.',
    cover: {
      src: projectReelReveal,
      alt: 'AI movie matching web application shown on screen',
    },
    tags: ['Design', 'Development', 'OpenAI'],
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Deliverables', value: 'Web app + website' },
      { label: 'AI', value: 'OpenAI' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Choosing a film takes longer than watching one. Streaming catalogues are huge, and genre filters and star ratings say little about whether a film fits what someone is in the mood for tonight.',
          'The brief was a product that asks a few simple questions and answers with a short list of films that fit, plus a website that explains the idea to new visitors.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed and developed both parts: the web application where the matching happens, and the website that introduces the product and brings people into it.',
          'The matching step is powered by OpenAI, so preferences can be described in plain words rather than squeezed into fixed filters.',
        ],
        bullets: [
          'User flow designed around a quick answer, not a long questionnaire',
          'OpenAI-powered matching from preferences written in natural language',
          'A marketing website that shares one visual language with the app',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: ['OpenAI'], // TODO(owner): review — add the rest of the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and store links if they can be shared. */
  {
    slug: 'calmisu',
    title: 'Calmisu',
    cardTitle: 'Calmisu App - Mindfulness Mobile Application',
    industry: 'Health & Wellness',
    summary:
      'A mindfulness mobile app built with Expo, with an AI chat companion that helps people slow down and check in with themselves in a few minutes a day.',
    cover: {
      src: projectCalmisuApp,
      alt: 'Calmisu mindfulness app screens on a phone',
    },
    tags: ['Design', 'Mobile App', 'Expo', 'Chat AI'],
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Platform', value: 'Mobile app' },
      { label: 'Framework', value: 'Expo' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Most mindfulness apps are libraries of audio tracks. People open them with good intentions and close them without knowing where to start.',
          'Calmisu needed to feel personal from the first screen: a calm interface and a conversation that meets people where they are.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed the app and built it with Expo, so one codebase serves both iOS and Android.',
          'At its centre is an AI chat companion. Instead of picking from a menu, people describe how they feel and the app responds.',
        ],
        bullets: [
          'Quiet, low-contrast interface designed for short daily sessions',
          'AI chat as the main way into the app',
          'One Expo codebase for iOS and Android',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: ['Expo', 'React Native'], // TODO(owner): review — add the rest of the stack
  },
  {
    slug: 'catoshi',
    title: 'Catoshi',
    cardTitle: 'Catoshi - AI-powered Forecasting Crypto Dashboard',
    industry: 'Fintech / Crypto',
    summary:
      'A crypto dashboard that turns raw market data and news into probability-based forecasts — built so the analysis is already waiting when you open it, not generated while you stare at a spinner.',
    cover: {
      src: projectCatoshi,
      alt: 'Catoshi dashboard shown on a laptop',
    },
    tags: ['Design', 'Development', 'AI', 'Dashboard', 'Landing Page'],
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Team', value: 'One engineer, end to end' },
      { label: 'Timeline', value: 'First working version in ~1 month' },
      { label: 'Status', value: 'In active development' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Anyone following crypto has the same two tabs open: a price chart that shows what already happened, and a news feed that never says which headline actually matters. Neither answers the only question worth asking — what is more likely to happen next, and how sure can you be.',
          'The goal was not another charting tool. It was a dashboard that commits to a view: three scenarios, each with a probability, updated on a schedule and kept honest by a record of how previous forecasts turned out.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'Catoshi collects market snapshots hourly, computes its own indicator set, pulls headlines from several crypto newsrooms, and hands all of it to an AI model that returns a bull / base / bear forecast with probabilities attached.',
          'Every forecast is written to a database before it is shown, so the dashboard can grade itself later — the hit rate is a feature, not a marketing line.',
        ],
        bullets: [
          'Bull / base / bear projections with explicit probabilities, not a single guessed price',
          'News classified by likely impact on the whole market or on one specific coin',
          'Forecast history stored so accuracy can be measured over time',
          'Dark-only interface built around long reading sessions on a screen full of numbers',
        ],
      },
      {
        heading: 'The engineering problem behind it',
        paragraphs: [
          'Running an AI model on every page view is the easy way to build this and the fastest way to make it unaffordable. The pipeline was designed around that constraint from the start.',
          'Scheduled jobs collect data hourly without touching the model. A separate scheduled run produces the forecast and posts it to the app’s own endpoint, where it is cached for six hours. Opening the site reads a ready result; if a scheduled run is ever missed, the first visitor falls back to a live generation so the page is never empty.',
        ],
        bullets: [
          'Data collection and AI inference split into separate schedules — the expensive step runs on its own cadence',
          'Six-hour cache on forecasts, with a fallback path when a scheduled run does not land',
          'Public, free data sources chosen deliberately to keep running costs near zero',
        ],
      },
      {
        heading: 'Where it stands',
        paragraphs: [
          'The data pipeline, the scheduled forecast ingestion and the dashboard are running. The scope was deliberately narrowed to forecasting and signals — no wallets, no portfolio tracking, no accounts — so the product does one thing before it does five.',
          'The next milestone is a public release with a visible accuracy record behind it.',
        ],
      },
    ],
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Neon Postgres',
      'Vercel',
      'GitHub Actions',
      'CoinGecko API',
      'Binance public API',
      'AI forecasting',
    ],
    gallery: [
      {
        src: heroCatoshiMobile,
        alt: 'Catoshi dashboard on mobile',
        caption: 'The same forecast view on mobile — the dashboard is read on a phone as often as on a desktop.',
      },
    ],
    results: [], // TODO(owner): real numbers — e.g. the forecast hit rate once it is published
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'nuance',
    title: 'Nuance',
    cardTitle: 'Nuance - AI Powered Web Application',
    industry: 'AI Software',
    summary:
      'An AI-powered web application built on OpenAI, designed and developed end to end — from the first screens to a working product.',
    cover: {
      src: projectNuance,
      alt: 'Nuance AI web application interface',
    },
    tags: ['Design', 'Development', 'OpenAI'],
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Platform', value: 'Web application' },
      { label: 'AI', value: 'OpenAI' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'AI features are easy to demo and hard to turn into a product people return to. The model is only half of it; the rest is an interface that makes the output clear and useful.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed the interface and developed the application around OpenAI, keeping the AI step behind a simple, focused workflow.',
        ],
        bullets: [
          'Product design from user flow to final screens',
          'Front end and OpenAI integration developed in-house',
          'An interface that keeps the AI output readable and easy to act on',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: ['OpenAI'], // TODO(owner): review — add the rest of the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'qa-freelancer-website',
    title: 'QA Freelancer Website',
    cardTitle: 'Website for QA Freelancer',
    industry: 'Software QA',
    summary:
      'A portfolio website for a freelance QA engineer that presents services, experience and past work, and makes it easy for a potential client to get in touch.',
    cover: {
      src: projectQa,
      alt: 'Portfolio website for a freelance QA engineer',
    },
    tags: ['Design', 'Development', 'Portfolio'],
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Deliverable', value: 'Portfolio website' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'A freelancer competes on trust. Without a site of their own, a QA engineer’s experience is spread across profiles and CVs that all look the same.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed and developed a personal portfolio site that explains what the engineer tests, how they work and what they have delivered, with a clear path to contact.',
        ],
        bullets: [
          'Services and experience laid out so a client can scan them in seconds',
          'Portfolio section for past projects',
          'Contact call to action on every screen',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'full-stack-developer-portfolio',
    title: 'Full Stack Developer Portfolio',
    cardTitle: 'Full Stack Developer Portfolio Website',
    industry: 'Software Development',
    summary:
      'A one-page portfolio website for a full stack developer that shows skills, projects and contact details at a glance.',
    cover: {
      src: projectPortfolioDev,
      alt: 'Full stack developer portfolio website',
    },
    tags: ['Design', 'Development', 'Landing Page'],
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Deliverable', value: 'Landing page' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Recruiters and clients spend seconds on a developer’s profile. A GitHub link and a CV rarely show how good the work actually is.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed and developed a single landing page that tells the story in one scroll: who the developer is, what they build, and how to hire them.',
        ],
        bullets: [
          'One-page structure that reads in under a minute',
          'Skills and projects presented as proof, not a list of buzzwords',
          'Clear contact call to action',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'low-code-landing-page',
    title: 'Low-Code Mobile Development Landing Page',
    cardTitle: 'Low Code Mobile Development Landing Page',
    industry: 'Mobile Development',
    summary:
      'A landing page that explains a low-code mobile development offer in plain language and turns visitors into leads.',
    cover: {
      src: projectLowCode,
      alt: 'Landing page for a low-code mobile development service',
    },
    tags: ['Design', 'Low-Code', 'Landing Page'],
    facts: [
      { label: 'Role', value: 'Design & low-code build' },
      { label: 'Deliverable', value: 'Landing page' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Low-code is still a vague idea for many buyers. The page had to explain what they get, why it is faster, and what it takes to start.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed the landing page and built it with low-code tools, so the team can update copy and sections without a developer.',
        ],
        bullets: [
          'A structure that answers the buyer’s questions in order',
          'Built with low-code tools the team can edit themselves',
          'Lead capture as the single goal of the page',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the low-code tool used
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'construction-company-website',
    title: 'Construction Company Website',
    cardTitle: 'Corporate Website for Construction Company',
    industry: 'Construction',
    summary:
      'A corporate website for a construction company that presents its services and completed projects, and gives prospective clients a clear way to request a quote.',
    cover: {
      src: projectBuilding,
      alt: 'Corporate website for a construction company',
    },
    tags: ['Design', 'Development', 'Corporate Website'],
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Deliverable', value: 'Corporate website' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'In construction, clients buy on reputation. The company’s finished work was its best argument, but it was not being shown anywhere in a way that built trust.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed and developed a corporate website that puts completed projects and services up front, with a straightforward route to getting in touch.',
        ],
        bullets: [
          'Services and projects organised so clients find what is relevant to them',
          'Large project imagery to show the quality of the work',
          'Contact and quote request always one click away',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'saas-landing-page',
    title: 'SaaS Platform Landing Page',
    cardTitle: 'Landing Page for Saas Platform',
    industry: 'SaaS',
    summary:
      'A landing page for a SaaS platform that shows off its dashboard and explains the product quickly enough for a visitor to decide to sign up.',
    cover: {
      src: projectInvest,
      alt: 'Landing page for a SaaS platform with a dashboard preview',
    },
    tags: ['Design', 'Dashboard', 'Landing Page'],
    facts: [
      { label: 'Role', value: 'Design' },
      { label: 'Deliverables', value: 'Landing page + dashboard' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'SaaS products are hard to explain in words. Visitors want to see the product before they give an email address.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed a landing page built around the product itself, with dashboard screens that show what the platform does instead of describing it.',
        ],
        bullets: [
          'Dashboard design used as the main visual on the page',
          'Benefits written for the buyer, not as a feature list',
          'Sign-up call to action repeated through the page',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the design tools or stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'digital-marketing-website',
    title: 'Digital Marketing Website',
    cardTitle: 'Digital Marketing Website',
    industry: 'Marketing',
    summary:
      'A corporate website for a digital marketing agency that presents its services clearly and turns visitors into enquiries.',
    cover: {
      src: projectMarketing,
      alt: 'Corporate website for a digital marketing agency',
    },
    tags: ['Design', 'Corporate Website', 'Marketing'],
    facts: [
      { label: 'Role', value: 'Design' },
      { label: 'Deliverable', value: 'Corporate website' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'A marketing agency’s own website is its first case study. If it looks generic, prospects assume the agency’s work for them will too.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed a corporate website with a confident visual style, a clear services structure and enquiry points throughout.',
        ],
        bullets: [
          'Services grouped so each visitor finds their need quickly',
          'Visual style that shows the agency’s creative standard',
          'Enquiry calls to action throughout the page',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the design tools or stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  {
    slug: 'designer-portfolio',
    title: 'Designer’s Portfolio',
    cardTitle: 'Designer’s Portfolio Website',
    industry: 'Design',
    summary:
      'A portfolio website built in Framer that puts a designer’s work front and centre and lets them add new projects without a developer.',
    cover: {
      src: projectPortfolioDesign,
      alt: 'Designer’s portfolio website built in Framer',
    },
    tags: ['Design', 'Portfolio', 'Framer'],
    facts: [
      { label: 'Role', value: 'Design & Framer build' },
      { label: 'Deliverable', value: 'Portfolio website' },
      { label: 'Platform', value: 'Framer' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'A designer’s portfolio is judged as a piece of design in its own right. It also has to be easy to update every time a new project is finished.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed the site and built it in Framer, so the work is presented with care and the owner can add new projects on their own.',
        ],
        bullets: [
          'Layout that lets the work carry the page',
          'Built in Framer for easy, code-free updates',
          'Smooth interactions that do not get in the way of the content',
        ],
      },
    ],
    results: [], // TODO(owner): real numbers
    stack: ['Framer'],
  },
];

export const getCaseStudy = (slug: string): ICaseStudy | undefined =>
  caseStudies.find((caseStudy) => caseStudy.slug === slug);
