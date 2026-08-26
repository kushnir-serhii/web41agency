import { About } from '@/components/about/About';
import { Faq } from '@/components/faq/Faq';
import { Hero } from '@/components/hero/Hero';
import { HowItWorks } from '@/components/howItWorks/HowItWorks';
import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { Portfolio } from '@/components/portfolio/Portfolio';
import { Services } from '@/components/services/Services';
import { TechStack } from '@/components/techStack/TechStack';
import { WhyChoose } from '@/components/whyChoose/WhyChoose';
import { howItWorksContent } from '@/content/howItWorksContent';
import { portfolioContent } from '@/content/portfolioContent';
import { whyChooseContent } from '@/content/whyChooseContent';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <About />
      <Services />
      {/* <TechStack /> */}
      <Portfolio content={portfolioContent} />
      <HowItWorks content={howItWorksContent} />
      <Faq />
      <WhyChoose content={whyChooseContent} />
      <LetsTalk />
    </div>
  );
}
