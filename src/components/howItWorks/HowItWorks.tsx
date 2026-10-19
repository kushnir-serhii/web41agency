import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';

import { HowItWorksItemProps } from './howItWorksComponents/howItWorksItem';
import { HowItWorksList } from './howItWorksComponents/HowItWorksList';

interface HowItWorksCta {
  title: string;
  href: string;
}

interface HowItWorksProps {
  content: {
    sectionTitle: string;
    mainContent: HowItWorksItemProps[];
    cta?: HowItWorksCta;
  };
}

export const HowItWorks = async ({ content }: HowItWorksProps) => {
  const tCta = await getTranslations('Cta');
  const { sectionTitle, mainContent, cta } = content;

  return (
    <div className="container flex-col justify-start items-start bg-white gap-10 section-y">
      <SectionHeading>{sectionTitle}</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 self-stretch w-full">
        <HowItWorksList
          howItWorksArray={mainContent}
          className="grid gap-6 md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 md:grid-cols-subgrid md:grid-rows-subgrid"
        />
        {cta && (
          <div className="flex flex-col justify-between items-start gap-8 lg:min-h-[351px] p-6 lg:p-8 rounded-lg bg-bg_item md:col-start-2 md:row-start-2">
            <h3 className="text-2xl lg:text-[32px] font-bold text-left text-black">{cta.title}</h3>
            <Button text={tCta('freeQuote')} href={cta.href} btnType="accent" />
          </div>
        )}
      </div>
    </div>
  );
};
