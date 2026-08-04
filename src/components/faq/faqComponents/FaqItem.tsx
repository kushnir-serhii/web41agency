"use client";

import { Icon } from "@/components/ui/Icon";
import { IFaqItem } from "@/content/faqContent";

interface FaqItemProps extends IFaqItem {
  isOpen: boolean;
  onToggle: () => void;
}

export const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <li
      className={`w-full transition-colors ${isOpen ? "bg-bg_item" : "bg-white hover:bg-bg_item"}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex justify-between items-center w-full gap-4 px-4 lg:px-20 py-6 lg:py-10 text-left cursor-pointer"
      >
        <span className="text-xl lg:text-[32px] text-black">{question}</span>
        <Icon
          id="icon-add"
          width={24}
          height={24}
          className={`shrink-0 duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 lg:px-20 pb-6 lg:pb-10 lg:max-w-[760px] opacity-80 text-base lg:text-lg text-left text-black">
            {answer}
          </p>
        </div>
      </div>
    </li>
  );
};
