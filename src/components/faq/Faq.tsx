"use client";

import { useState } from "react";
import { faqContent } from "@/content/faqContent";
import { FaqItem } from "./faqComponents/FaqItem";

export const Faq = () => {
  const { sectionTitle, questions } = faqContent;
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-start gap-8">
      <div className="w-full px-4 lg:px-20">
        <h2 className="w-full text-4xl lg:text-6xl font-semibold text-left text-black">
          {sectionTitle}
        </h2>
      </div>

      <ul className="flex flex-col items-start w-full">
        {questions.map((item) => (
          <FaqItem
            key={item.question}
            {...item}
            isOpen={openQuestion === item.question}
            onToggle={() =>
              setOpenQuestion((prev) =>
                prev === item.question ? null : item.question
              )
            }
          />
        ))}
      </ul>
    </section>
  );
};
