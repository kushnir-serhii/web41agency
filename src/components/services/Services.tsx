"use client";

import { useState } from "react";
import { servicesContent } from "@/content/servicesContent";
import { ServiceItem } from "./servicesComponents/ServiceItem";

export const Services = () => {
  const { sectionTitle, services } = servicesContent;
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-start gap-8">
      <div className="w-full px-4 lg:px-20">
        <h2 className="w-full text-4xl lg:text-6xl font-semibold text-left text-black">
          {sectionTitle}
        </h2>
      </div>

      <ul className="flex flex-col items-start w-full">
        {services.map((service) => (
          <ServiceItem
            key={service.title}
            {...service}
            isOpen={openTitle === service.title}
            onToggle={() =>
              setOpenTitle((prev) =>
                prev === service.title ? null : service.title
              )
            }
          />
        ))}
      </ul>
    </section>
  );
};
