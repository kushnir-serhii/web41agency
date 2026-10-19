import { Button } from '@/components/ui/Button';

import { HowItWorksItemProps } from './howItWorksComponents/howItWorksItem';
import { HowItWorksList } from './howItWorksComponents/HowItWorksList';

interface HowItWorksCta {
  title: string;
  text: string;
  href: string;
}

interface HowItWorksProps {
  content: {
    sectionTitle: string;
    mainContent: HowItWorksItemProps[];
    cta?: HowItWorksCta;
  };
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ content }) => {
  const { sectionTitle, mainContent, cta } = content;

  return (
    <div className="container flex-col justify-start items-start bg-white gap-10 py-20 lg:py-40">
      <h2 className="self-stretch w-full text-4xl lg:text-6xl font-semibold text-left text-black">
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 self-stretch w-full">
        <HowItWorksList
          howItWorksArray={mainContent}
          className="grid gap-6 md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 md:grid-cols-subgrid md:grid-rows-subgrid"
        />
        {cta && (
          <div className="flex flex-col justify-between items-start gap-8 lg:min-h-[351px] p-6 lg:p-8 rounded-lg bg-accent md:col-start-2 md:row-start-2">
            <h3 className="text-2xl lg:text-[32px] font-bold text-left text-black">{cta.title}</h3>
            <Button text={cta.text} href={cta.href} />
          </div>
        )}
      </div>
    </div>
  );
};
