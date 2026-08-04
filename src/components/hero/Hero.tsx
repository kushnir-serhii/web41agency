import { PageHero } from "@/components/pageHero/PageHero";
import { HeroAnimation } from "./heroComponents/HeroAnimation";

export const Hero: React.FC = () => {
  return (
    <PageHero
      heading={[
        { text: "Custom", muted: true },
        { text: "Websites & Web Apps –" },
        { text: "Built to Perform", muted: true },
      ]}
      description="From sleek Webflow sites to full-stack JS solutions, we design, develop, and launch websites that grow."
    >
      <HeroAnimation />
    </PageHero>
  );
};
