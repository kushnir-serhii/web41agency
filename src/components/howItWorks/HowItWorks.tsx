import { HowItWorksItemProps } from "./howItWorksComponents/howItWorksItem";
import { HowItWorksList } from "./howItWorksComponents/HowItWorksList";

interface HowItWorksProps {
  content: {
    sectionTitle: string;
    mainContent: HowItWorksItemProps[];
  };
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ content }) => {
  const { sectionTitle, mainContent } = content;

  return (
    <div className="container flex-col justify-start items-start bg-white gap-10 py-20 lg:py-40">
      <h2 className="self-stretch w-full text-4xl lg:text-6xl font-semibold text-left text-black">
        {sectionTitle}
      </h2>
      <HowItWorksList howItWorksArray={mainContent} />
    </div>
  );
};
