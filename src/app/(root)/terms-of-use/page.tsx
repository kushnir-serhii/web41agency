import type { Metadata } from 'next';

import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { termsOfUse } from '@/content/legal/terms';

const { title, description, lastUpdated, intro, sections } = termsOfUse;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/terms-of-use' },
  robots: { index: true, follow: true },
};

export default function TermsOfUsePage() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="container pt-16 lg:pt-24 pb-20 lg:pb-28">
        <article className="flex flex-col gap-10 w-full max-w-[760px] mx-auto text-black">
          <header className="flex flex-col gap-4">
            <h1 className="text-4xl lg:text-6xl font-semibold">{title}</h1>
            <p className="text-base text-black/60">Last updated: {lastUpdated}</p>
            {intro.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </header>

          {sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-2xl lg:text-3xl font-semibold">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="flex flex-col gap-2 pl-6 list-disc text-lg leading-relaxed">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
      <LetsTalk />
    </div>
  );
}
