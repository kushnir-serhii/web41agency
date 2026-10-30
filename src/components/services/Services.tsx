'use client';

import { useState } from 'react';

import { IconBadge } from '@/components/ui/IconBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { IService, IServiceFeature } from '@/content/servicesContent';

import { ServiceItem } from './servicesComponents/ServiceItem';

interface ServicesProps {
  content: { sectionTitle: string; services: IService[] };
  featuresContent: { title: string; features: IServiceFeature[] };
  /* The Services page already names the section in its H1, so the H2 is kept for
     the outline but hidden visually. */
  hideTitle?: boolean;
}

export const Services: React.FC<ServicesProps> = ({ content, featuresContent, hideTitle }) => {
  const { sectionTitle, services } = content;
  const { title: featuresTitle, features } = featuresContent;
  const [openTitle, setOpenTitle] = useState<string | null>(services[0]?.title ?? null);

  return (
    <section
      className={`w-full max-w-[1440px] mx-auto flex flex-col items-start gap-8 ${hideTitle ? 'pt-4 lg:pt-6' : 'section-y'}`}
    >
      <div className={hideTitle ? 'sr-only' : 'w-full px-4 lg:px-20'}>
        <SectionHeading>{sectionTitle}</SectionHeading>
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

      <div className="w-full flex flex-col gap-8 px-4 lg:px-20 pt-2 lg:pt-12">
        <h3 className="text-2xl lg:text-4xl font-semibold text-left text-black">{featuresTitle}</h3>
        <ul className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4 lg:gap-6">
          {features.map(({ title, description, iconPath }) => (
            <li
              key={title}
              className="grid grid-cols-[auto_1fr] md:flex md:flex-col items-start gap-x-3 gap-y-0.5 md:gap-4 border-b border-black/10 py-3 last:border-b-0 md:rounded-lg md:border-0 md:bg-bg_item md:p-6"
            >
              <IconBadge size="sm" className="row-span-2">
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
              </IconBadge>
              <h4 className="text-lg md:text-xl font-semibold text-left text-black">{title}</h4>
              <p className="opacity-80 text-sm md:text-base text-left text-black">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
