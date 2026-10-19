import { getTranslations } from 'next-intl/server';

import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { WhyChooseList } from './whyChooseComponents/WhyChooseList';

export interface IWhyChooseContent {
  sectionTitle: string;
  href: string;
  mainContent: {
    iconId: string;
    title: string;
    description: {
      text: string;
      highlight: boolean;
    }[];
  }[];
}

interface WhyChooseProps {
  content: IWhyChooseContent;
}
export const WhyChoose = async ({ content }: WhyChooseProps) => {
  const tCta = await getTranslations('Cta');
  const { sectionTitle, href, mainContent } = content;

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-start items-start relative gap-10 px-4 lg:px-20 section-y">
      <SectionHeading>{sectionTitle}</SectionHeading>
      <WhyChooseList mainContent={mainContent} />
      <Button text={tCta('freeQuote')} href={href} />
    </div>
  );
};
