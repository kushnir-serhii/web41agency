import { About } from "@/components/about/About";
import { LetsTalk } from "@/components/letsTalk/LetsTalk";
import { PageHero } from "@/components/pageHero/PageHero";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { portfolioContent } from "@/content/portfolioContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Web41",
  description:
    "We create sleek, high-performing websites tailored to your needs. Explore our portfolio and see how we bring ideas to life.",
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <PageHero
        heading={[
          { text: "Our Work:", muted: true },
          { text: "Websites" },
          { text: "that Drive Results", muted: true },
        ]}
        description="We create sleek, high-performing websites tailored to your needs. Explore our portfolio below and see how we bring ideas to life."
      />
      <PortfolioGrid projects={portfolioContent.projects} />
      <About />
      <LetsTalk />
    </div>
  );
}
