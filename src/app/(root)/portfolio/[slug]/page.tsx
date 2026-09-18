import { CaseBlocks } from '@/components/caseStudy/CaseBlocks';
import { CaseCta } from '@/components/caseStudy/CaseCta';
import { CaseFacts } from '@/components/caseStudy/CaseFacts';
import { CaseGallery } from '@/components/caseStudy/CaseGallery';
import { CaseHero } from '@/components/caseStudy/CaseHero';
import { CaseResults } from '@/components/caseStudy/CaseResults';
import { CaseStack } from '@/components/caseStudy/CaseStack';
import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { caseStudies, getCaseStudy } from '@/content/caseStudiesContent';
import { SITE_URL } from '@/utils/site';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

/* Only slugs with real written content get a page — everything else 404s. */
export const generateStaticParams = () => caseStudies.map(({ slug }) => ({ slug }));

export const dynamicParams = false;

export const generateMetadata = async ({ params }: CasePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) return {};

  // The root layout's template appends " | Web41 Agency" — do not repeat it here.
  const title = `${caseStudy.title} — Case Study`;

  return {
    title,
    description: caseStudy.summary,
    alternates: { canonical: `/portfolio/${caseStudy.slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/portfolio/${caseStudy.slug}`,
      title,
      description: caseStudy.summary,
      images: [{ url: caseStudy.cover.src.src, alt: caseStudy.cover.alt }],
    },
  };
};

export default async function CaseStudyPage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) notFound();

  const currentIndex = caseStudies.findIndex((item) => item.slug === caseStudy.slug);
  const nextCase = caseStudies[(currentIndex + 1) % caseStudies.length];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseStudy.cardTitle,
    description: caseStudy.summary,
    url: `${SITE_URL}/portfolio/${caseStudy.slug}`,
    about: caseStudy.industry,
    image: `${SITE_URL}${caseStudy.cover.src.src}`,
    keywords: caseStudy.tags.join(', '),
    creator: { '@type': 'Organization', name: 'Web41 Agency', url: SITE_URL },
  };

  return (
    <div className="flex flex-col items-center w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CaseHero
        title={caseStudy.title}
        industry={caseStudy.industry}
        summary={caseStudy.summary}
        cover={caseStudy.cover}
        tags={caseStudy.tags}
        liveUrl={caseStudy.liveUrl}
      />
      <CaseFacts facts={caseStudy.facts} />
      <CaseBlocks blocks={caseStudy.blocks} />
      {caseStudy.results && caseStudy.results.length > 0 && (
        <CaseResults results={caseStudy.results} />
      )}
      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <CaseGallery images={caseStudy.gallery} />
      )}
      {caseStudy.stack.length > 0 && <CaseStack stack={caseStudy.stack} />}
      <CaseCta nextCase={nextCase.slug === caseStudy.slug ? undefined : nextCase} />
      <LetsTalk />
    </div>
  );
}
