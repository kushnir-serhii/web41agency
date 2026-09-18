import { LetsTalk } from "@/components/letsTalk/LetsTalk";
import { PageHero } from "@/components/pageHero/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts",
  description: "Get in touch with Web41 Agency — tell us what you need and we'll come back with a plan and a price.",
  alternates: { canonical: "/contacts" },
};

// TODO(content): messengers and a physical address are placeholders below —
// replace with the real values (and remove this comment) as soon as they're
// finalized, per step 7 of docs/seo-plan-en.md.
export default function ContactsPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <PageHero
        heading={[
          { text: "Let's Talk" },
          { text: "About Your Project", muted: true },
        ]}
        description="Email us, send a message below, or reach out on messengers — whatever's easiest for you."
      />
      <div className="container flex-col gap-2 pb-10">
        <p className="text-lg text-black">
          <span className="font-semibold">Email:</span>{" "}
          <a href="mailto:hello@web41.agency" className="hover:underline">
            hello@web41.agency
          </a>
        </p>
        <p className="text-lg text-black/70">
          <span className="font-semibold text-black">Messengers:</span> coming soon
        </p>
        <p className="text-lg text-black/70">
          <span className="font-semibold text-black">Address:</span> coming soon
        </p>
      </div>
      <LetsTalk />
    </div>
  );
}
