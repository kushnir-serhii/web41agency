"use client";

import { Icon } from "@/components/ui/Icon";
import { IService } from "@/content/servicesContent";

interface ServiceItemProps extends IService {
  isOpen: boolean;
  onToggle: () => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  description,
  price,
  timeline,
  isOpen,
  onToggle,
}) => {
  return (
    <li
      className={`group relative w-full overflow-hidden transition-colors hover:bg-bg_item ${
        isOpen ? "bg-bg_item" : ""
      }`}
    >
      {/* Accent circle bleeding in from the left edge of the row */}
      <span
        aria-hidden
        className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[76px] rounded-full bg-accent
          transition-opacity duration-300 lg:group-hover:opacity-100 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
      />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="relative flex flex-col lg:flex-row lg:items-center w-full gap-4 px-4 lg:px-20 py-6 lg:h-[120px] text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 w-full lg:w-1/2">
          <span className="text-2xl lg:text-[32px] text-black">{title}</span>
          <Icon
            id="icon-arrow_outward"
            width={17}
            height={17}
            className={`shrink-0 transition-opacity duration-300 lg:group-hover:opacity-100 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div
          className={`flex flex-col w-full lg:w-1/2 gap-2 transition-all duration-300
            lg:opacity-0 lg:group-hover:opacity-80 ${
              isOpen ? "opacity-80" : "hidden lg:flex"
            }`}
        >
          <p className="opacity-80 text-lg text-black">{description}</p>
          <p className="text-base text-black/70">
            {price} · {timeline}
          </p>
        </div>
      </button>
    </li>
  );
};
