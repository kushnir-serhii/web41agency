import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { WhyChoose } from '@/components/whyChoose/WhyChoose';
import { whyChooseContent } from '@/content/whyChooseContent';

export default function AboutUsPage() {
  return (
    <div className="container flex-col">
      <WhyChoose content={whyChooseContent} />
      <LetsTalk />
    </div>
  );
}
