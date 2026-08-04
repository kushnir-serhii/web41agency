import { Icon } from "@/components/ui/Icon";

export interface HowItWorksItemProps {
    logoId: string;
    title: string;
    description: string
}
export const HowItWorksItem: React.FC<HowItWorksItemProps> = ({ logoId, title, description }) => {
  
  return (
    <div
      className={`flex flex-col items-start h-full min-h-[351px] w-full gap-10 lg:gap-20 p-6 lg:p-8 rounded-lg
     bg-bg_item ${logoId ? "justify-between" : "justify-end"} `}
    >
      {logoId && (
        <div className="flex justify-center items-center rounded-full shrink-0 size-20 bg-accent">
          <Icon id={logoId} width={35} height={35} />{" "}
        </div>
      )}

      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <h3 className="self-stretch w-full text-2xl lg:text-[32px] font-bold text-left text-black">
          {/* Launch &amp; Grow */}
          {title}
        </h3>
        <p className="self-stretch w-full opacity-80 text-lg text-left text-black">
          {/* We deliver a high-performance, scalable solution, ensuring seamless
          deployment and providing support to help your business thrive. */}
          {description}
        </p>
      </div>
    </div>
  );
};