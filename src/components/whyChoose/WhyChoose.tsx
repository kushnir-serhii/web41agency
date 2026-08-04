import { Button } from "../ui/Button";
import { WhyChooseList } from "./whyChooseComponents/WhyChooseList";

export interface IWhyChooseContent {
  sectionTitle: string;
  textButton: string;
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
export const WhyChoose: React.FC<WhyChooseProps> = ({ content }) => {
  const { sectionTitle, textButton, mainContent } = content;

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-start items-start relative gap-10 px-4 lg:px-20 py-20 lg:py-40">
      <h2 className="self-stretch w-full text-4xl lg:text-6xl font-semibold text-left text-black">
        {sectionTitle}
      </h2>
      <WhyChooseList mainContent={mainContent} />
      <Button text={textButton} fill />
    </div>
  );
};
