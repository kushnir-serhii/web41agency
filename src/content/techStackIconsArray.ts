// Server-side accessor: call getTechStack from server components and pass the result
// down as props (`server-only` is not installed, so not enforced).
import type { Locale } from '@/i18n/types';

const techStackBase = [
  { id: 'icon-adobe' },
  { id: 'icon-ai' },
  { id: 'icon-css' },
  { id: 'icon-figma' },
  { id: 'icon-fraimer' },
  { id: 'icon-html' },
  { id: 'icon-js' },
  { id: 'icon-lottie' },
  { id: 'icon-nextjs' },
  { id: 'icon-node' },
  { id: 'icon-react' },
  { id: 'icon-redux' },
  { id: 'icon-tailwind' },
  { id: 'icon-typescript' },
  { id: 'icon-webflow' },
] as const;

export type TechStackId = (typeof techStackBase)[number]['id'];

interface TechStackCopy {
  /** Accessible label for the icon. */
  label: string;
}

export interface TechStackItem extends TechStackCopy {
  id: TechStackId;
}

const techStackEn = {
  'icon-adobe': { label: 'Adobe' },
  'icon-ai': { label: 'Adobe Illustrator' },
  'icon-css': { label: 'CSS' },
  'icon-figma': { label: 'Figma' },
  'icon-fraimer': { label: 'Framer' },
  'icon-html': { label: 'HTML' },
  'icon-js': { label: 'JavaScript' },
  'icon-lottie': { label: 'Lottie' },
  'icon-nextjs': { label: 'Next.js' },
  'icon-node': { label: 'Node.js' },
  'icon-react': { label: 'React' },
  'icon-redux': { label: 'Redux' },
  'icon-tailwind': { label: 'Tailwind CSS' },
  'icon-typescript': { label: 'TypeScript' },
  'icon-webflow': { label: 'Webflow' },
} satisfies Record<TechStackId, TechStackCopy>;

const techStackCopy = {
  en: techStackEn,
  uk: {
    'icon-adobe': { label: 'Adobe' },
    'icon-ai': { label: 'Adobe Illustrator' },
    'icon-css': { label: 'CSS' },
    'icon-figma': { label: 'Figma' },
    'icon-fraimer': { label: 'Framer' },
    'icon-html': { label: 'HTML' },
    'icon-js': { label: 'JavaScript' },
    'icon-lottie': { label: 'Lottie' },
    'icon-nextjs': { label: 'Next.js' },
    'icon-node': { label: 'Node.js' },
    'icon-react': { label: 'React' },
    'icon-redux': { label: 'Redux' },
    'icon-tailwind': { label: 'Tailwind CSS' },
    'icon-typescript': { label: 'TypeScript' },
    'icon-webflow': { label: 'Webflow' },
  },
} satisfies Record<Locale, Record<TechStackId, TechStackCopy>>;

export function getTechStack(locale: Locale): TechStackItem[] {
  return techStackBase.map(({ id }) => ({ id, ...techStackCopy[locale][id] }));
}
