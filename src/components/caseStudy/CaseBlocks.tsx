import { ICaseBlock } from '@/content/caseStudiesContent';

interface CaseBlocksProps {
  blocks: ICaseBlock[];
}

export const CaseBlocks: React.FC<CaseBlocksProps> = ({ blocks }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col gap-16 lg:gap-20 px-4 lg:px-20 py-10">
      {blocks.map(({ heading, paragraphs, bullets }) => (
        <article
          key={heading}
          className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-16"
        >
          <h2 className="w-full lg:w-[380px] shrink-0 text-3xl lg:text-[40px] font-bold leading-tight text-left text-black">
            {heading}
          </h2>

          <div className="flex flex-col items-start gap-6 w-full lg:max-w-[720px]">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-lg leading-relaxed text-left text-black"
              >
                {paragraph}
              </p>
            ))}

            {bullets && (
              <ul className="flex flex-col items-start gap-4 w-full">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-4 text-lg leading-relaxed text-black"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-2.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </section>
  );
};
