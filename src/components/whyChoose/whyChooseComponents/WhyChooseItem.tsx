import { Icon } from '@/components/ui/Icon';
import { IconBadge } from '@/components/ui/IconBadge';

interface IDescription {
  text: string;
  highlight: boolean;
}

export interface WhyChooseItemProps {
  iconId: string;
  title: string;
  description: IDescription[];
}

export const WhyChooseItem: React.FC<WhyChooseItemProps> = ({ iconId, title, description }) => {
  return (
    <div className="flex flex-col justify-start items-start w-full relative gap-6 lg:pr-4 rounded-lg">
      <IconBadge>
        <Icon id={iconId} width={37} height={36} />
      </IconBadge>
      <h3 className="self-stretch w-full lg:max-w-[400px] text-xl lg:text-[32px] font-bold text-left text-black">
        {title}
      </h3>
      <p className="self-stretch w-full lg:max-w-[400px] opacity-80 text-lg text-left text-black">
        {description.map((item, index) => (
          <span key={index} className={item.highlight ? 'font-bold' : 'font-normal'}>
            {item.text}
          </span>
        ))}
      </p>
    </div>
  );
};
