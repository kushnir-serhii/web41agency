import { HowItWorksItem, HowItWorksItemProps } from "./howItWorksItem";

interface HowItWorksListProps {
  howItWorksArray: HowItWorksItemProps[];
}
export const HowItWorksList: React.FC<HowItWorksListProps> = ({
  howItWorksArray,
}) => {

  return (
    <ul className="flex flex-wrap justify-start items-stretch self-stretch gap-6">
      {howItWorksArray.map((item) => (
        <li key={item.logoId} className="w-full lg:w-[calc(50%-12px)]">
          <HowItWorksItem
            logoId={item.logoId}
            title={item.title}
            description={item.description}
          />
        </li>
      ))}
    </ul>
  );
};
