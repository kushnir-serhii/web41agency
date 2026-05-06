import dynamic from "next/dynamic";

import { About } from "@/components/about/About";
import { Faq } from "@/components/faq/Faq";
import { Hero } from "@/components/hero/Hero";
// import { GoogleBtn } from "@/components/ui/GoogleBtn";
import { HowItWorks } from "@/components/howItWorks/HowItWorks";
import { Services } from "@/components/services/Services";
import { WhyChoose } from "@/components/whyChoose/WhyChoose";
import { howItWorksContent } from "@/content/howItWorksContent";
import { whyChooseContent } from "@/content/whyChooseContent";


const DynamicTechStack = dynamic(() => import("@/components/techStack/TechStack").then((module) => module.TechStack));


export default function Home() {
  return (
    <div className="items-center justify-items-center pb-40 gap-16">
      <Hero />
      {/* <About /> */}
      {/* <Services /> */}
      {/* <DynamicTechStack /> */}
      <div className="flex-1">

      {/* <GoogleBtn /> */}
      </div>
      {/* <HowItWorks content={howItWorksContent} /> */}
      {/* <Faq /> */}
      {/* <WhyChoose content={whyChooseContent} /> */}

      {/* <HorizontalSlider /> */}
    </div>
  );
}
