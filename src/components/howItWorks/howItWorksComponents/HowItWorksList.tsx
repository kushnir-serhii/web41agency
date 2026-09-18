import { HowItWorksItem, HowItWorksItemProps } from "./howItWorksItem";

interface HowItWorksListProps {
  howItWorksArray: HowItWorksItemProps[];
  className?: string;
}

export const HowItWorksList: React.FC<HowItWorksListProps> = ({
  howItWorksArray,
  className,
}) => {
  return (
    <ol className={className}>
      {howItWorksArray.map((item, index) => (
        <li key={item.title}>
          <HowItWorksItem
            logoId={item.logoId}
            title={item.title}
            description={item.description}
            step={index + 1}
          />
        </li>
      ))}
    </ol>
  );
};
