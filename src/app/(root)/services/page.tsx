import { LetsTalk } from "@/components/letsTalk/LetsTalk";
import { PageHero } from "@/components/pageHero/PageHero";
import { Services } from "@/components/services/Services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, landing pages, redesigns, integrations and ongoing support — built on Next.js and delivered by Web41 Agency.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <PageHero
        heading={[
          { text: "Services" },
          { text: "Built to Ship", muted: true },
        ]}
        description="From a single landing page to a full custom build — pick what you need below, or get in touch and we'll scope it together."
      />
      <Services />
      <LetsTalk />
    </div>
  );
}
