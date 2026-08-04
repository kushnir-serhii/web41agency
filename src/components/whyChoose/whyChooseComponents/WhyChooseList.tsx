import { WhyChooseItem } from "./WhyChooseItem";

interface HowItWorksList {
  mainContent: {
    iconId: string;
    title: string;
    description: {
      text: string;
      highlight: boolean;
    }[];
  }[];
}
export const WhyChooseList: React.FC<HowItWorksList> = ({ mainContent }) => {
  return (
    <ul className="flex flex-col lg:flex-row justify-start items-start self-stretch gap-10 lg:gap-4">
      {mainContent.map((item) => (
        <li key={item.iconId} className="w-full lg:flex-1">
          <WhyChooseItem
            iconId={item.iconId}
            title={item.title}
            description={item.description}
          />
        </li>
      ))}
    </ul>
  );
};
