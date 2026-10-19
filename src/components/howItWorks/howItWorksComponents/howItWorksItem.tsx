import { Icon } from '@/components/ui/Icon';
import { IconBadge } from '@/components/ui/IconBadge';

export interface HowItWorksItemProps {
  logoId: string;
  title: string;
  description: string;
}

interface HowItWorksItemComponentProps extends HowItWorksItemProps {
  step: number;
}

export const HowItWorksItem: React.FC<HowItWorksItemComponentProps> = ({
  logoId,
  title,
  description,
  step,
}) => {
  return (
    <div className="relative flex flex-col justify-start items-start h-full lg:min-h-[351px] w-full gap-6 md:gap-8 lg:gap-20 p-6 lg:p-8 rounded-lg bg-bg_item">
      <span
        aria-hidden="true"
        className="absolute top-6 right-6 lg:top-8 lg:right-8 text-5xl lg:text-6xl font-bold leading-none text-black/55"
      >
        {String(step).padStart(2, '0')}
      </span>

      <IconBadge size="lg">
        <Icon id={logoId} width={35} height={35} />
      </IconBadge>

      <div className="flex flex-col justify-start items-start gap-2">
        <h3 className="self-stretch w-full text-2xl lg:text-[32px] font-bold text-left text-black">
          {title}
        </h3>
        <p className="self-stretch w-full opacity-80 text-lg text-left text-black">{description}</p>
      </div>
    </div>
  );
};
