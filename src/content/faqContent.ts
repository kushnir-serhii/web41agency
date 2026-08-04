export interface IFaqItem {
  question: string;
  answer: string;
}

export const faqContent: {
  sectionTitle: string;
  questions: IFaqItem[];
} = {
  sectionTitle: "FAQ",
  questions: [
    {
      question: "What’s the difference between low and pure code?",
      answer:
        "Webflow allows us to create visually stunning, no-code websites that are easy to manage, perfect for fast turnarounds. JavaScript development, using Next.js and TypeScript, is ideal for fully custom, high-performance web applications with complex functionality.",
    },
    {
      question: "How do I know which solution is right for me?",
      answer:
        "We start with a free consultation: we look at your goals, timeline and budget, then recommend the approach that gets you there fastest without boxing you in later.",
    },
    {
      question: "Do you offer design services as well?",
      answer:
        "Yes. We cover the full process — research, UX, UI and brand identity — and hand off a design system your developers can build on, or build it ourselves.",
    },
    {
      question: "How long does it take to build a website?",
      answer:
        "A Webflow site typically takes 2–4 weeks. A custom JavaScript application depends on scope, and we give you a detailed timeline before any work starts.",
    },
    {
      question: "Can I update my website myself after launch?",
      answer:
        "Absolutely. Webflow sites come with a CMS you can edit yourself, and for custom builds we can add an admin panel so your team stays independent.",
    },
    {
      question: "Do you offer post-launch support?",
      answer:
        "Yes. We offer ongoing support and maintenance packages covering updates, monitoring, and new features as your product grows.",
    },
  ],
};
