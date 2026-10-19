'use client';

import { useState } from 'react';

import { SectionHeading } from '@/components/ui/SectionHeading';
import type { IFaqItem } from '@/content/faqContent';

import { FaqItem } from './faqComponents/FaqItem';

interface FaqProps {
  content: { sectionTitle: string; questions: IFaqItem[] };
}

export const Faq: React.FC<FaqProps> = ({ content }) => {
  const { sectionTitle, questions } = content;
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-start gap-8 section-y">
      <div className="w-full px-4 lg:px-20">
        <SectionHeading>{sectionTitle}</SectionHeading>
      </div>

      <ul className="flex flex-col items-start w-full">
        {questions.map((item) => (
          <FaqItem
            key={item.question}
            {...item}
            isOpen={openQuestion === item.question}
            onToggle={() =>
              setOpenQuestion((prev) => (prev === item.question ? null : item.question))
            }
          />
        ))}
      </ul>
    </section>
  );
};
