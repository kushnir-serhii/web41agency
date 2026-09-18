import type { Metadata } from 'next';

import { LetsTalk } from '@/components/letsTalk/LetsTalk';
import { WhyChoose } from '@/components/whyChoose/WhyChoose';
import { whyChooseContent } from '@/content/whyChooseContent';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Web41 Agency builds fast, modern websites and web apps for small businesses — design, development and launch, without the agency overhead.',
  alternates: { canonical: '/about-us' },
};

export default function AboutUsPage() {
  return (
    <div className="container flex-col">
      <WhyChoose content={whyChooseContent} />
      <LetsTalk />
    </div>
  );
}
