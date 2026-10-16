import { getTranslations } from 'next-intl/server';

interface CaseStackProps {
  stack: string[];
}

export const CaseStack = async ({ stack }: CaseStackProps) => {
  const t = await getTranslations('CaseStudy');

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 py-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-16">
        <h2 className="w-full lg:w-[380px] shrink-0 text-3xl lg:text-[40px] font-bold leading-tight text-left text-black">
          {t('stack')}
        </h2>
        <ul className="flex flex-wrap items-start gap-2 w-full lg:max-w-[720px]">
          {stack.map((item) => (
            <li
              key={item}
              className="flex justify-center items-center px-4 py-2 rounded-[100px] border border-black/10 text-lg leading-[18px] text-black whitespace-nowrap"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
