// Server-side accessor: call getCaseStudy from server components and pass the result down as props.
import { StaticImageData } from 'next/image';

import type { Locale } from '@/i18n/types';

import {
  heroCatoshiMobile,
  projectBuilding,
  projectCalmisuApp,
  projectCatoshi,
  projectInvest,
  projectInvestDashboard,
  projectInvestRegister,
  projectLowCode,
  projectMarketing,
  projectMemeAcademy,
  projectMeridian,
  projectMeridianCoffee,
  projectMeridianMobile,
  projectNuance,
  projectPortfolioDesign,
  projectPortfolioDev,
  projectQa,
  projectReelReveal,
} from '../../public/images';
import {
  type CaseStudySlug,
  caseStudySlugs,
  getCaseStudyTitle,
  isCaseStudySlug,
} from './caseStudyTitles';
import { getProjectLabels } from './portfolioContent';

export { caseStudySlugs } from './caseStudyTitles';

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

/* Non-translatable data. Title, cardTitle, industry and tags come from caseStudyTitles and
   portfolioContent, so they are written once. */
interface CaseStudyBase {
  cover: StaticImageData;
  /* Result values only; labels live in the copy, matched by index. */
  results?: readonly string[];
  stack: readonly string[];
  /* Gallery images only; alt and caption live in the copy, matched by index. */
  gallery?: readonly StaticImageData[];
  liveUrl?: string;
}

interface CaseImageCopy {
  alt: string;
  caption?: string;
}

interface CaseStudyCopy {
  summary: string;
  coverAlt: string;
  facts: ICaseFact[];
  blocks: ICaseBlock[];
  /* One label per base result value, same order. */
  resultLabels?: string[];
  /* One entry per base gallery image, same order. */
  gallery?: CaseImageCopy[];
}

const caseStudyBase = {
  /* Source: serhii-k_stack projects.ts (reel-reveal). */
  'ai-movie-matching': {
    cover: projectReelReveal,
    results: ['2'],
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'useSWR',
      'React Hook Form',
      'MongoDB',
      'OpenAI API',
      'TMDB API',
      'Stripe',
    ],
    liveUrl: 'https://www.reel-reveal.club/',
  },
  /* Source: serhii-k_stack projects.ts (calmisu). */
  calmisu: {
    cover: projectCalmisuApp,
    results: ['4', '6', '4'],
    stack: [
      'React Native (Expo)',
      'TypeScript',
      'Neon',
      'RevenueCat',
      'Firebase Analytics',
      'Astro',
    ],
    liveUrl: 'https://calmisu.com',
  },
  catoshi: {
    cover: projectCatoshi,
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Neon Postgres',
      'pgvector',
      'Claude API',
      'Vercel',
      'GitHub Actions',
      'CoinGecko API',
      'Binance public API',
    ],
    gallery: [heroCatoshiMobile],
    results: ['4+', '16-dim'], // TODO(owner): add the forecast hit rate once it is published
  },
  /* Source: serhii-k_stack projects.ts (nuance, shown there as "Workplace English"). */
  nuance: {
    cover: projectNuance,
    results: ['8', '3'],
    stack: ['React', 'Vite', 'TypeScript', 'Lovable', 'Claude Code', 'OpenAI API', 'Supabase'],
    liveUrl: 'https://julia-builds.github.io/nuance/',
  },
  /* Source: serhii-k_stack projects.ts (meridian). */
  'meridian-coffee-shop': {
    cover: projectMeridian,
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    gallery: [projectMeridianCoffee, projectMeridianMobile],
    liveUrl: 'https://coffee-shop-five-rouge.vercel.app/',
  },
  /* Source: serhii-k_stack projects.ts (meme-academy). */
  'meme-academy': {
    cover: projectMemeAcademy,
    results: ['3', '10'],
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      'Socket.io',
      'Node.js',
      'Express',
      'next-intl',
    ],
    liveUrl: 'https://meme-academy.vercel.app',
  },
  /* Source: serhii-k_stack projects.ts (invest). Replaces the old "SaaS Platform Landing Page"
     placeholder, which showed the same Investico screens. */
  investico: {
    cover: projectInvest,
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Material UI',
      'useSWR',
      'Axios',
      'Strapi',
      'Node.js',
      'PostgreSQL',
      'OpenAI API',
    ],
    gallery: [projectInvestDashboard, projectInvestRegister],
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  'qa-freelancer-website': {
    cover: projectQa,
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  'full-stack-developer-portfolio': {
    cover: projectPortfolioDev,
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  'low-code-landing-page': {
    cover: projectLowCode,
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the low-code tool used
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  'construction-company-website': {
    cover: projectBuilding,
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  'digital-marketing-website': {
    cover: projectMarketing,
    results: [], // TODO(owner): real numbers
    stack: [], // TODO(owner): review — add the design tools or stack
  },
  /* TODO(owner): review — drafted from the project title and tags.
     TODO(owner): real numbers — add client, year, results and live URL if they can be shared. */
  'designer-portfolio': {
    cover: projectPortfolioDesign,
    results: [], // TODO(owner): real numbers
    stack: ['Framer'],
  },
} satisfies Record<CaseStudySlug, CaseStudyBase>;

const caseStudiesEn = {
  'ai-movie-matching': {
    summary:
      'A web application and marketing website that use OpenAI to match people with films they will actually want to watch, instead of another endless scroll through a catalogue.',
    coverAlt: 'AI movie matching web application shown on screen',
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Team', value: 'Designer and developer' },
      { label: 'Timeline', value: '4 months' },
      { label: 'Year', value: '2024' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Choosing a film takes longer than watching one. Streaming catalogues are huge, and genre filters and star ratings say little about whether a film fits what someone is in the mood for tonight.',
          'Existing platforms lean on basic genre filtering. There was no AI-driven matching that understands nuanced preferences, so the brief was a product that asks a few simple questions and answers with films that fit.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed the product and built the full stack from scratch: a preference quiz on the front end, and OpenAI on the back end turning the answers into personalised recommendations.',
          'A second AI feature suggests similar movies based on a title the user already likes, independent of the quiz.',
        ],
        bullets: [
          'Quiz-driven OpenAI recommendations',
          'Similar-movies matching from a title the user picks',
          'Google authentication, with user data stored in MongoDB',
          'TMDB API for posters, ratings and cast, and Stripe for payments',
        ],
      },
    ],
    resultLabels: ['AI-driven features (quiz + similar movies)'],
  },
  calmisu: {
    summary:
      'A mindfulness mobile app built with Expo, with an AI chat companion that helps people slow down and check in with themselves in a few minutes a day.',
    coverAlt: 'Calmisu mindfulness app screens on a phone',
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Team', value: 'Designer and developer' },
      { label: 'Platform', value: 'Mobile app + landing site' },
      { label: 'Framework', value: 'Expo' },
      { label: 'Status', value: 'Live since 2026' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Most anxiety apps compete on the same handful of breathing and meditation exercises, with no visual hook and no organic growth engine.',
          'Calmisu needed a real differentiator and a way to be found without paid acquisition.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'The app leads with calligraphy tracing, a meditative and tactile alternative to yet another breathing timer, alongside guided breathing, nature soundscapes and a reflective AI chat with safety guardrails.',
          'We designed both the app and its Astro landing site. The site and blog are built for search from the ground up, so it can grow organically on a zero-dollar marketing budget.',
        ],
        bullets: [
          'Calligraphy tracing, breathing, soundscapes and AI chat in one calming flow',
          'Subscriptions through RevenueCat and funnel tracking with Firebase Analytics',
          'Technical SEO: JSON-LD structured data, Core Web Vitals fixes and a long-tail blog',
          'Landing site in four languages: English, Polish, Ukrainian and Spanish',
        ],
      },
    ],
    resultLabels: [
      'Core relaxation techniques',
      'SEO-optimised blog articles shipped',
      'Languages on the landing site',
    ],
  },
  catoshi: {
    summary:
      'A crypto dashboard that turns raw market data and news into probability-based forecasts — built so the analysis is already waiting when you open it, not generated while you stare at a spinner.',
    coverAlt: 'Catoshi dashboard shown on a laptop',
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Team', value: 'One engineer, end to end' },
      { label: 'Timeline', value: 'First working version in ~1 month' },
      { label: 'Year', value: '2026' },
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
    gallery: [
      {
        alt: 'Catoshi dashboard on mobile',
        caption:
          'The same forecast view on mobile — the dashboard is read on a phone as often as on a desktop.',
      },
    ],
    resultLabels: ['Free data sources integrated', 'Market-state vector for analog search'],
  },
  nuance: {
    summary:
      'An AI-powered workplace communication platform that helps non-native English speakers master the social nuance of global tech companies through realistic scenarios and instant AI feedback.',
    coverAlt: 'Nuance AI web application interface',
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Team', value: 'Designer and developer' },
      { label: 'Timeline', value: '1 month' },
      { label: 'Year', value: '2026' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'International professionals often know the grammar but struggle with the unwritten rules of workplace communication: how to disagree, push back, give feedback and manage up without appearing difficult.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'The project started as a Lovable prototype. We took it over, refactored and extended it into a working product built around realistic workplace scenarios.',
          'Users write a response and AI scores it for social appropriateness, strategic effectiveness and cultural awareness, with actionable feedback.',
        ],
        bullets: [
          'Scenario-based learning: feedback, managing up, conflict and disagreement',
          'AI response evaluation with a score and up to three attempts per scenario',
          'Searchable phrase library comparing ineffective and effective wording',
          'Progress tracking, daily missions, coaching insights and voice input',
        ],
      },
    ],
    resultLabels: ['Learning modules', 'Attempts per scenario'],
  },
  'meridian-coffee-shop': {
    summary:
      'A ready-to-sell online shop for a coffee brand: product catalogue, subscriptions, cart and checkout, designed to turn visitors into regular customers.',
    coverAlt: 'Meridian coffee shop website shown on a laptop',
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Timeline', value: '1 week' },
      { label: 'Year', value: '2026' },
      { label: 'Status', value: 'Demo shop, payments switched off' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'A coffee business sells two very different things. Beans are a small purchase people repeat every few weeks. Grinders and espresso machines are expensive, and customers compare carefully before buying.',
          'A typical template shop handles both the same way, so it loses sales on both.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We designed and built a shop that sells each product the way customers actually buy it. Coffee pages sell on taste (origin, flavour notes, roast level) to make the choice quick. Equipment pages sell on trust, with clear specifications, real photos of every colour and side-by-side comparison, so buyers feel confident spending more.',
          'Everything from a €48 dripper to a €2,890 espresso machine shares one brand look, one cart and one checkout.',
        ],
        bullets: [
          'Filters by roast, taste and brewing method, plus equipment by category and price',
          'Coffee subscription every week, two weeks or month, with up to 15% off',
          'One cart for all products, remembered when the customer comes back',
          'Short three-step checkout ending in a clear order confirmation',
          'Mobile-first pages with rich previews when products are shared',
        ],
      },
      {
        heading: 'Ready to grow',
        paragraphs: [
          'It is a demo, so payments are switched off, but the same foundation can be connected to real payments, delivery and a second language.',
        ],
      },
    ],
    gallery: [
      {
        alt: 'Meridian coffee product page',
        caption: 'Coffee pages sell on taste: origin, flavour notes and roast level.',
      },
      {
        alt: 'Meridian coffee shop on mobile',
        caption: 'Designed for phone shoppers first.',
      },
    ],
  },
  'meme-academy': {
    summary:
      'A real-time multiplayer party game in the spirit of Cards Against Humanity: friends join a room from a shared link, match meme cards to funny prompts and take turns as the judge.',
    coverAlt: 'Meme Academy party game start screen on a phone',
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Team', value: 'One engineer, end to end' },
      { label: 'Year', value: '2026' },
      { label: 'Status', value: 'Live' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Party games like this usually mean a box of physical cards or a native app install. There was nothing lightweight a group could open from a link on any device.',
          'For that to work, every player’s screen has to stay in sync in real time, and a dropped connection mid-round cannot cost someone their hand or their score.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'Players create or join a room by code, get dealt a hand of meme cards, and pick the one that best fits the judge’s prompt. The judge chooses the funniest, and the winner judges the next round.',
          'The game runs as two services: a Next.js client and a separate Socket.io server that owns all game logic. The server checks every action (is this player the judge, is it the right phase) and the client always re-syncs to it instead of trusting its own state.',
        ],
        bullets: [
          'Live rooms for up to 10 players, with no download or sign-up',
          'Rotating judge, with a submission order locked per round so judging stays fair',
          'Players who drop out rejoin mid-game without losing their seat, hand or score',
          'Full English, Ukrainian and Polish support, including server messages and prompt cards',
        ],
      },
    ],
    resultLabels: ['Languages shipped (EN / UK / PL)', 'Players per room'],
  },
  investico: {
    summary:
      'A multilingual platform where startups and investors find each other, with AI-assisted matching to cut down on cold outreach.',
    coverAlt: 'Investico landing page shown on a laptop',
    facts: [
      { label: 'Role', value: 'Full-stack development' },
      { label: 'Team', value: 'Two engineers' },
      { label: 'Timeline', value: '3 months' },
      { label: 'Year', value: '2024' },
    ],
    blocks: [
      {
        heading: 'The problem',
        paragraphs: [
          'Startups looking for funding and investors looking for deals mostly meet through cold emails and personal networks. Both sides waste time on matches that were never going to fit.',
          'The brief was a dedicated platform for discovery and matching, in several languages, with structured profiles on both sides and AI to suggest the right fits.',
        ],
      },
      {
        heading: 'What we built',
        paragraphs: [
          'We built the full stack: a multilingual Next.js front end, a Strapi back end on PostgreSQL, and OpenAI-powered matching between investors and startups.',
          'Each side signs up through its own flow. Investors then browse startups with filters for stage, industry, market and investment needed.',
        ],
        bullets: [
          'Separate registration flows for investors and startups, with role-based access',
          'Startup search filtered by stage, industry, traction and investment needed',
          'OpenAI matching suggestions based on startup stage, industry and investor criteria',
          'Multilingual content managed in the CMS, with locale-aware routing',
        ],
      },
    ],
    gallery: [
      {
        alt: 'Investico startup search with filters',
        caption: 'Investors filter startups by stage, industry, traction and investment needed.',
      },
      {
        alt: 'Investico sign-up screen asking whether the user is an investor or a startup',
        caption: 'Investors and startups each get their own sign-up flow.',
      },
    ],
  },
  'qa-freelancer-website': {
    summary:
      'A portfolio website for a freelance QA engineer that presents services, experience and past work, and makes it easy for a potential client to get in touch.',
    coverAlt: 'Portfolio website for a freelance QA engineer',
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
  },
  'full-stack-developer-portfolio': {
    summary:
      'A one-page portfolio website for a full stack developer that shows skills, projects and contact details at a glance.',
    coverAlt: 'Full stack developer portfolio website',
    facts: [
      { label: 'Role', value: 'Design & development' },
      { label: 'Team', value: 'Designer and developer' },
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
  },
  'low-code-landing-page': {
    summary:
      'A landing page that explains a low-code mobile development offer in plain language and turns visitors into leads.',
    coverAlt: 'Landing page for a low-code mobile development service',
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
  },
  'construction-company-website': {
    summary:
      'A corporate website for a construction company that presents its services and completed projects, and gives prospective clients a clear way to request a quote.',
    coverAlt: 'Corporate website for a construction company',
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
  },
  'digital-marketing-website': {
    summary:
      'A corporate website for a digital marketing agency that presents its services clearly and turns visitors into enquiries.',
    coverAlt: 'Corporate website for a digital marketing agency',
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
  },
  'designer-portfolio': {
    summary:
      'A portfolio website built in Framer that puts a designer’s work front and centre and lets them add new projects without a developer.',
    coverAlt: 'Designer’s portfolio website built in Framer',
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
  },
} satisfies Record<CaseStudySlug, CaseStudyCopy>;

/* TODO(owner): review — Ukrainian draft translation of the English copy above. */
const caseStudiesUk = {
  'ai-movie-matching': {
    summary:
      'Вебзастосунок і маркетинговий сайт, які за допомогою OpenAI підбирають фільми, що людям справді захочеться подивитися, замість чергового нескінченного гортання каталогу.',
    coverAlt: 'Вебзастосунок для підбору фільмів на основі AI на екрані',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Команда', value: 'Дизайнер і розробник' },
      { label: 'Терміни', value: '4 місяці' },
      { label: 'Рік', value: '2024' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Вибрати фільм довше, ніж його подивитися. Каталоги стримінгів величезні, а фільтри за жанрами та зіркові рейтинги мало що кажуть про те, чи пасує фільм настрою на сьогоднішній вечір.',
          'Наявні платформи покладаються на базову фільтрацію за жанрами. Не було підбору на основі AI, який розуміє тонкі вподобання, тож завданням був продукт, що ставить кілька простих запитань і відповідає фільмами, які підходять.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували продукт і з нуля розробили весь стек: квіз уподобань на фронтенді та OpenAI на бекенді, що перетворює відповіді на персональні рекомендації.',
          'Друга AI-функція пропонує схожі фільми на основі назви, яка вже подобається користувачеві, незалежно від квізу.',
        ],
        bullets: [
          'Рекомендації OpenAI на основі квізу',
          'Підбір схожих фільмів за назвою, яку обирає користувач',
          'Авторизація через Google, дані користувачів зберігаються в MongoDB',
          'TMDB API для постерів, рейтингів і акторського складу, Stripe для платежів',
        ],
      },
    ],
    resultLabels: ['AI-функції (квіз + схожі фільми)'],
  },
  calmisu: {
    summary:
      'Мобільний застосунок для усвідомленості на Expo з AI-співрозмовником, який допомагає сповільнитися й прислухатися до себе за кілька хвилин на день.',
    coverAlt: 'Екрани застосунку для усвідомленості Calmisu на телефоні',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Команда', value: 'Дизайнер і розробник' },
      { label: 'Платформа', value: 'Мобільний застосунок + лендінг' },
      { label: 'Фреймворк', value: 'Expo' },
      { label: 'Статус', value: 'Працює з 2026 року' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Більшість застосунків проти тривожності конкурують однаковим набором дихальних вправ і медитацій, без візуальної родзинки та без механізму органічного зростання.',
          'Calmisu потребував справжньої відмінності від конкурентів і способу знаходити користувачів без платного залучення.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Головна фішка застосунку — обведення каліграфії, медитативна й тактильна альтернатива черговому дихальному таймеру. Поруч — дихальні практики з підказками, звуки природи та рефлексивний AI-чат із захисними обмеженнями.',
          'Ми спроєктували і застосунок, і його лендінг на Astro. Сайт і блог від початку побудовані під пошук, тож можуть зростати органічно з нульовим маркетинговим бюджетом.',
        ],
        bullets: [
          'Каліграфія, дихання, звуки природи та AI-чат в одному заспокійливому сценарії',
          'Підписки через RevenueCat і відстеження воронки у Firebase Analytics',
          'Технічне SEO: структуровані дані JSON-LD, виправлення Core Web Vitals і блог під низькочастотні запити',
          'Лендінг чотирма мовами: англійською, польською, українською та іспанською',
        ],
      },
    ],
    resultLabels: [
      'Основні техніки релаксації',
      'Опубліковані SEO-оптимізовані статті блогу',
      'Мови лендінгу',
    ],
  },
  catoshi: {
    summary:
      'Криптодашборд, який перетворює сирі ринкові дані та новини на прогнози з ймовірностями. Аналіз уже готовий, коли ви відкриваєте сторінку, а не генерується, поки ви дивитеся на індикатор завантаження.',
    coverAlt: 'Дашборд Catoshi на ноутбуці',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Команда', value: 'Один інженер, від і до' },
      { label: 'Терміни', value: 'Перша робоча версія приблизно за місяць' },
      { label: 'Рік', value: '2026' },
      { label: 'Статус', value: 'В активній розробці' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Кожен, хто стежить за криптою, тримає відкритими ті самі дві вкладки: графік ціни, що показує вже минуле, і стрічку новин, яка ніколи не каже, який заголовок справді важливий. Жодна не відповідає на єдине важливе питання — що найімовірніше станеться далі і наскільки можна бути в цьому впевненим.',
          'Метою був не ще один інструмент для графіків, а дашборд, що має власну позицію: три сценарії, кожен з ймовірністю, які оновлюються за розкладом і перевіряються історією того, як справдилися попередні прогнози.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Catoshi щогодини збирає знімки ринку, обчислює власний набір індикаторів, підтягує заголовки з кількох криптовидань і передає все це AI-моделі, яка повертає бичачий, базовий і ведмежий прогноз з ймовірностями.',
          'Кожен прогноз записується в базу даних до того, як його показують, тож згодом дашборд може оцінити сам себе — точність прогнозів тут функція, а не маркетинговий слоган.',
        ],
        bullets: [
          'Бичачий, базовий і ведмежий сценарії з явними ймовірностями замість однієї вгаданої ціни',
          'Новини класифікуються за ймовірним впливом на весь ринок або на окрему монету',
          'Історія прогнозів зберігається, щоб з часом вимірювати точність',
          'Лише темний інтерфейс, розрахований на довге читання екрана, повного цифр',
        ],
      },
      {
        heading: 'Інженерне завдання за цим',
        paragraphs: [
          'Запускати AI-модель при кожному перегляді сторінки — найпростіший спосіб це побудувати і найшвидший спосіб зробити це непомірно дорогим. Конвеєр від початку проєктувався з урахуванням цього обмеження.',
          'Заплановані задачі щогодини збирають дані, не звертаючись до моделі. Окремий запуск за розкладом створює прогноз і надсилає його на власний ендпоінт застосунку, де він кешується на шість годин. Відкриваючи сайт, користувач отримує готовий результат; якщо запуск за розкладом колись пропущено, перший відвідувач запускає генерацію наживо, тож сторінка ніколи не буває порожньою.',
        ],
        bullets: [
          'Збір даних і AI-інференс розділені на окремі розклади — дорогий крок працює у власному ритмі',
          'Кеш прогнозів на шість годин із резервним шляхом, якщо запуск за розкладом не відбувся',
          'Публічні безкоштовні джерела даних обрано свідомо, щоб витрати на роботу були близькі до нуля',
        ],
      },
      {
        heading: 'На якому етапі проєкт',
        paragraphs: [
          'Конвеєр даних, отримання прогнозів за розкладом і дашборд уже працюють. Обсяг свідомо звужено до прогнозів і сигналів — без гаманців, без відстеження портфеля, без акаунтів, — щоб продукт добре робив одну річ, перш ніж братися за п’ять.',
          'Наступний етап — публічний реліз із відкритою історією точності прогнозів.',
        ],
      },
    ],
    gallery: [
      {
        alt: 'Дашборд Catoshi на мобільному',
        caption:
          'Той самий екран прогнозу на мобільному — дашборд читають з телефона так само часто, як з комп’ютера.',
      },
    ],
    resultLabels: [
      'Підключені безкоштовні джерела даних',
      'Вектор стану ринку для пошуку аналогів',
    ],
  },
  nuance: {
    summary:
      'Платформа для робочої комунікації на основі AI, яка допомагає людям, для яких англійська не рідна, опанувати соціальні нюанси глобальних технологічних компаній через реалістичні сценарії та миттєвий AI-фідбек.',
    coverAlt: 'Інтерфейс AI-вебзастосунку Nuance',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Команда', value: 'Дизайнер і розробник' },
      { label: 'Терміни', value: '1 місяць' },
      { label: 'Рік', value: '2026' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Іноземні фахівці часто добре знають граматику, але мають труднощі з неписаними правилами робочої комунікації: як не погодитися, заперечити, дати фідбек і впливати на керівництво, не здаючись конфліктними.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Проєкт починався як прототип на Lovable. Ми взяли його в роботу, відрефакторили й розширили до робочого продукту, побудованого навколо реалістичних робочих сценаріїв.',
          'Користувач пише відповідь, а AI оцінює її за соціальною доречністю, стратегічною ефективністю та культурною обізнаністю і дає практичний фідбек.',
        ],
        bullets: [
          'Навчання на сценаріях: фідбек, взаємодія з керівництвом, конфлікти та незгода',
          'AI-оцінка відповіді з балом і до трьох спроб на сценарій',
          'Бібліотека фраз із пошуком, що порівнює невдалі та вдалі формулювання',
          'Відстеження прогресу, щоденні місії, поради коуча та голосове введення',
        ],
      },
    ],
    resultLabels: ['Навчальні модулі', 'Спроби на сценарій'],
  },
  'meridian-coffee-shop': {
    summary:
      'Готовий до продажів інтернет-магазин кавового бренду: каталог товарів, підписки, кошик і оформлення замовлення, створені, щоб перетворювати відвідувачів на постійних клієнтів.',
    coverAlt: 'Сайт кав’ярні Meridian на ноутбуці',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Терміни', value: '1 тиждень' },
      { label: 'Рік', value: '2026' },
      { label: 'Статус', value: 'Демомагазин, платежі вимкнено' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Кавовий бізнес продає дві дуже різні речі. Зерно — невелика покупка, яку повторюють кожні кілька тижнів. Кавомолки та еспресо-машини дорогі, і клієнти ретельно порівнюють їх перед покупкою.',
          'Типовий магазин на шаблоні обробляє обидва випадки однаково, тож втрачає продажі на обох.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували й розробили магазин, що продає кожен товар так, як його насправді купують. Сторінки кави продають смаком (походження, смакові ноти, ступінь обсмаження), щоб вибір був швидким. Сторінки обладнання продають довірою: чіткі характеристики, справжні фото кожного кольору та порівняння поруч, щоб покупці впевнено витрачали більше.',
          'Усе — від дріпера за €48 до еспресо-машини за €2,890 — має єдиний фірмовий стиль, один кошик і одне оформлення замовлення.',
        ],
        bullets: [
          'Фільтри за обсмаженням, смаком і способом заварювання, а обладнання — за категорією та ціною',
          'Кавова підписка щотижня, раз на два тижні або щомісяця зі знижкою до 15%',
          'Один кошик для всіх товарів, який зберігається, коли клієнт повертається',
          'Коротке оформлення замовлення у три кроки з чітким підтвердженням',
          'Сторінки, створені насамперед для мобільних, з гарними превʼю, коли товарами діляться',
        ],
      },
      {
        heading: 'Готовий до зростання',
        paragraphs: [
          'Це демоверсія, тому платежі вимкнено, але ту саму основу можна підключити до реальних платежів, доставки та другої мови.',
        ],
      },
    ],
    gallery: [
      {
        alt: 'Сторінка кавового товару Meridian',
        caption: 'Сторінки кави продають смаком: походження, смакові ноти та ступінь обсмаження.',
      },
      {
        alt: 'Кав’ярня Meridian на мобільному',
        caption: 'Створено насамперед для покупців зі смартфонами.',
      },
    ],
  },
  'meme-academy': {
    summary:
      'Мультиплеєрна гра для компанії в реальному часі в дусі Cards Against Humanity: друзі заходять у кімнату за спільним посиланням, підбирають мем-картки до смішних завдань і по черзі стають суддею.',
    coverAlt: 'Стартовий екран гри Meme Academy на телефоні',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Команда', value: 'Один інженер, від і до' },
      { label: 'Рік', value: '2026' },
      { label: 'Статус', value: 'Працює' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Такі ігри для компанії зазвичай означають коробку фізичних карток або встановлення застосунку. Не було нічого легкого, що компанія могла б відкрити за посиланням на будь-якому пристрої.',
          'Щоб це працювало, екрани всіх гравців мають синхронізуватися в реальному часі, а обрив з’єднання посеред раунду не може коштувати комусь карт на руці чи очок.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Гравці створюють кімнату або заходять у неї за кодом, отримують мем-картки й обирають ту, що найкраще пасує до завдання судді. Суддя вибирає найсмішнішу, і переможець судить наступний раунд.',
          'Гра складається з двох сервісів: клієнта на Next.js і окремого сервера на Socket.io, який відповідає за всю ігрову логіку. Сервер перевіряє кожну дію (чи є гравець суддею, чи правильна фаза), а клієнт завжди синхронізується з ним, а не довіряє власному стану.',
        ],
        bullets: [
          'Живі кімнати до 10 гравців без завантаження та реєстрації',
          'Суддя змінюється, а порядок відповідей фіксується на кожен раунд, щоб суддівство було чесним',
          'Гравці, які випали, повертаються посеред гри, не втрачаючи місця, карт чи очок',
          'Повна підтримка англійської, української та польської, включно з повідомленнями сервера та картками завдань',
        ],
      },
    ],
    resultLabels: ['Мови (EN / UK / PL)', 'Гравців у кімнаті'],
  },
  investico: {
    summary:
      'Багатомовна платформа, де стартапи та інвестори знаходять одне одного, а підбір за допомогою AI зменшує кількість холодних звернень.',
    coverAlt: 'Лендінг Investico на ноутбуці',
    facts: [
      { label: 'Роль', value: 'Full-stack розробка' },
      { label: 'Команда', value: 'Двоє інженерів' },
      { label: 'Терміни', value: '3 місяці' },
      { label: 'Рік', value: '2024' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Стартапи, що шукають фінансування, та інвестори, що шукають угоди, здебільшого знаходять одне одного через холодні листи й особисті знайомства. Обидві сторони витрачають час на варіанти, які ніколи б не підійшли.',
          'Завданням була окрема платформа для пошуку й підбору кількома мовами, зі структурованими профілями обох сторін і AI, що пропонує відповідних партнерів.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми розробили весь стек: багатомовний фронтенд на Next.js, бекенд на Strapi з PostgreSQL і підбір інвесторів та стартапів на основі OpenAI.',
          'Кожна сторона реєструється через власний сценарій. Далі інвестори переглядають стартапи з фільтрами за стадією, галуззю, ринком і потрібним обсягом інвестицій.',
        ],
        bullets: [
          'Окремі сценарії реєстрації для інвесторів і стартапів з доступом за ролями',
          'Пошук стартапів із фільтрами за стадією, галуззю, тракшеном і потрібним обсягом інвестицій',
          'Пропозиції підбору від OpenAI на основі стадії стартапу, галузі та критеріїв інвестора',
          'Багатомовний контент, керований у CMS, з маршрутизацією з урахуванням мови',
        ],
      },
    ],
    gallery: [
      {
        alt: 'Пошук стартапів у Investico з фільтрами',
        caption:
          'Інвестори фільтрують стартапи за стадією, галуззю, тракшеном і потрібним обсягом інвестицій.',
      },
      {
        alt: 'Екран реєстрації Investico з вибором, хто користувач: інвестор чи стартап',
        caption: 'Інвестори та стартапи мають кожен свій сценарій реєстрації.',
      },
    ],
  },
  'qa-freelancer-website': {
    summary:
      'Сайт-портфоліо для QA-інженера на фрилансі, що представляє послуги, досвід і попередні роботи та дає потенційному клієнту простий спосіб зв’язатися.',
    coverAlt: 'Сайт-портфоліо QA-інженера на фрилансі',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Результат', value: 'Сайт-портфоліо' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Фрилансер конкурує довірою. Без власного сайту досвід QA-інженера розпорошений по профілях і резюме, які виглядають однаково.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували й розробили персональний сайт-портфоліо, який пояснює, що інженер тестує, як він працює і що вже зробив, з чітким шляхом до контакту.',
        ],
        bullets: [
          'Послуги та досвід подано так, щоб клієнт переглянув їх за лічені секунди',
          'Розділ портфоліо з попередніми проєктами',
          'Заклик зв’язатися на кожному екрані',
        ],
      },
    ],
  },
  'full-stack-developer-portfolio': {
    summary:
      'Односторінковий сайт-портфоліо full stack розробника, що з першого погляду показує навички, проєкти та контакти.',
    coverAlt: 'Сайт-портфоліо full stack розробника',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Команда', value: 'Дизайнер і розробник' },
      { label: 'Результат', value: 'Лендінг' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Рекрутери та клієнти витрачають на профіль розробника лічені секунди. Посилання на GitHub і резюме рідко показують, наскільки якісна його робота.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували й розробили один лендінг, який розповідає історію за одне прокручування: хто цей розробник, що він створює і як його найняти.',
        ],
        bullets: [
          'Односторінкова структура, яку можна прочитати менш ніж за хвилину',
          'Навички та проєкти подано як докази, а не як список модних слів',
          'Чіткий заклик зв’язатися',
        ],
      },
    ],
  },
  'low-code-landing-page': {
    summary:
      'Лендінг, що простою мовою пояснює пропозицію low-code мобільної розробки та перетворює відвідувачів на заявки.',
    coverAlt: 'Лендінг сервісу low-code мобільної розробки',
    facts: [
      { label: 'Роль', value: 'Дизайн і збірка на low-code' },
      { label: 'Результат', value: 'Лендінг' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Для багатьох покупців low-code досі розмите поняття. Сторінка мала пояснити, що вони отримають, чому це швидше і що потрібно, щоб почати.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували лендінг і зібрали його на low-code інструментах, тож команда може оновлювати тексти й секції без розробника.',
        ],
        bullets: [
          'Структура, що по черзі відповідає на запитання покупця',
          'Зібрано на low-code інструментах, які команда редагує самостійно',
          'Збір заявок як єдина мета сторінки',
        ],
      },
    ],
  },
  'construction-company-website': {
    summary:
      'Корпоративний сайт будівельної компанії, що представляє її послуги та завершені проєкти і дає потенційним клієнтам зрозумілий спосіб запросити кошторис.',
    coverAlt: 'Корпоративний сайт будівельної компанії',
    facts: [
      { label: 'Роль', value: 'Дизайн і розробка' },
      { label: 'Результат', value: 'Корпоративний сайт' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'У будівництві клієнти обирають за репутацією. Завершені роботи були найкращим аргументом компанії, але ніде не показувалися так, щоб викликати довіру.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували й розробили корпоративний сайт, що ставить на перший план завершені проєкти та послуги і пропонує простий шлях до контакту.',
        ],
        bullets: [
          'Послуги та проєкти впорядковано так, щоб клієнти знаходили те, що їм потрібно',
          'Великі фото проєктів показують якість робіт',
          'Контакт і запит кошторису завжди за один клік',
        ],
      },
    ],
  },
  'digital-marketing-website': {
    summary:
      'Корпоративний сайт агенції цифрового маркетингу, що чітко представляє її послуги та перетворює відвідувачів на запити.',
    coverAlt: 'Корпоративний сайт агенції цифрового маркетингу',
    facts: [
      { label: 'Роль', value: 'Дизайн' },
      { label: 'Результат', value: 'Корпоративний сайт' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Власний сайт маркетингової агенції — її перший кейс. Якщо він виглядає шаблонно, потенційні клієнти припускають, що й робота для них буде такою самою.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували корпоративний сайт із впевненим візуальним стилем, зрозумілою структурою послуг і точками для запитів по всій сторінці.',
        ],
        bullets: [
          'Послуги згруповано так, щоб кожен відвідувач швидко знаходив потрібне',
          'Візуальний стиль, що демонструє творчий рівень агенції',
          'Заклики залишити запит по всій сторінці',
        ],
      },
    ],
  },
  'designer-portfolio': {
    summary:
      'Сайт-портфоліо на Framer, який ставить роботи дизайнера в центр уваги та дозволяє додавати нові проєкти без розробника.',
    coverAlt: 'Сайт-портфоліо дизайнера, створений на Framer',
    facts: [
      { label: 'Роль', value: 'Дизайн і збірка на Framer' },
      { label: 'Результат', value: 'Сайт-портфоліо' },
      { label: 'Платформа', value: 'Framer' },
    ],
    blocks: [
      {
        heading: 'Проблема',
        paragraphs: [
          'Портфоліо дизайнера оцінюють як самостійну дизайнерську роботу. Водночас його має бути легко оновлювати щоразу, коли завершено новий проєкт.',
        ],
      },
      {
        heading: 'Що ми створили',
        paragraphs: [
          'Ми спроєктували сайт і зібрали його на Framer, тож роботи подано дбайливо, а власник може сам додавати нові проєкти.',
        ],
        bullets: [
          'Макет, у якому сторінку тримають самі роботи',
          'Зібрано на Framer для простих оновлень без коду',
          'Плавні взаємодії, що не заважають контенту',
        ],
      },
    ],
  },
} satisfies Record<CaseStudySlug, CaseStudyCopy>;

const caseStudiesCopy = {
  en: caseStudiesEn,
  uk: caseStudiesUk,
} satisfies Record<Locale, Record<CaseStudySlug, CaseStudyCopy>>;

function buildCaseStudy(slug: CaseStudySlug, locale: Locale): ICaseStudy {
  const base: CaseStudyBase = caseStudyBase[slug];
  const copy: CaseStudyCopy = caseStudiesCopy[locale][slug];
  const { title: cardTitle, industry, tags } = getProjectLabels(slug, locale);

  return {
    slug,
    title: getCaseStudyTitle(slug, locale),
    cardTitle,
    industry,
    summary: copy.summary,
    cover: { src: base.cover, alt: copy.coverAlt },
    tags,
    facts: copy.facts,
    blocks: copy.blocks,
    results: base.results?.map((value, i) => ({ label: copy.resultLabels?.[i] ?? '', value })),
    stack: [...base.stack],
    gallery: base.gallery?.map((src, i) => ({
      src,
      alt: copy.gallery?.[i]?.alt ?? '',
      caption: copy.gallery?.[i]?.caption,
    })),
    liveUrl: base.liveUrl,
  };
}

/* Same order as the portfolio cards, so "Next project" follows the grid. */
export function getCaseStudies(locale: Locale): ICaseStudy[] {
  return caseStudySlugs.map((slug) => buildCaseStudy(slug, locale));
}

export function getCaseStudy(slug: string, locale: Locale): ICaseStudy | undefined {
  return isCaseStudySlug(slug) ? buildCaseStudy(slug, locale) : undefined;
}
