import { Icon } from "@/components/ui/Icon";

interface IDescription {
  text: string;
  highlight: boolean;
 }

export interface WhyChooseItemProps {
  iconId: string;
  title: string;
  description: IDescription[];
}

export const WhyChooseItem: React.FC<WhyChooseItemProps> = ({
  iconId,
  title,
  description
}) => {

  return (
    <div className="flex flex-col justify-start items-start flex-grow relative gap-6 pr-4 rounded-lg">
      <div className="flex justify-center items-center rounded-full shrink-0 size-20 bg-accent">
        <Icon id={iconId} width={37} height={36} />{" "}
      </div>
      <h3 className="self-stretch flex-grow-0 flex-shrink-0 w-[400px] text-[32px] font-bold text-left text-black">
        {title}
      </h3>
      <p className="self-stretch flex-grow-0 flex-shrink-0 max-w-[400px] w-full opacity-80 text-lg text-left text-black">
        {description.map((item, index) => (
          <span key={index} className={item.highlight ? "font-bold" : "font-normal"}>
            {item.text}
          </span>
        ))}
      </p>
    </div>
  );
};
