'use client';

import { useState } from 'react';

import type { IService, IServiceFeature } from '@/content/servicesContent';

import { ServiceItem } from './servicesComponents/ServiceItem';

interface ServicesProps {
  content: { sectionTitle: string; services: IService[] };
  featuresContent: { title: string; features: IServiceFeature[] };
}

export const Services: React.FC<ServicesProps> = ({ content, featuresContent }) => {
  const { sectionTitle, services } = content;
  const { title: featuresTitle, features } = featuresContent;
  const [openTitle, setOpenTitle] = useState<string | null>(services[0]?.title ?? null);

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
            onToggle={() => setOpenTitle((prev) => (prev === service.title ? null : service.title))}
          />
        ))}
      </ul>

      <div className="w-full flex flex-col gap-8 px-4 lg:px-20 pt-8 lg:pt-12">
        <h3 className="text-2xl lg:text-4xl font-semibold text-left text-black">{featuresTitle}</h3>
        <ul className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map(({ title, description, iconPath }) => (
            <li key={title} className="flex flex-col items-start gap-4 rounded-2xl bg-bg_item p-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <path d={iconPath} />
                </svg>
              </span>
              <h4 className="text-xl font-semibold text-left text-black">{title}</h4>
              <p className="opacity-80 text-base text-left text-black">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
