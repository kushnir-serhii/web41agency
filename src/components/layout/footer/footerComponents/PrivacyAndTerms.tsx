import { SITE_NAME } from "@/utils/site";
import Link from "next/link";

const linkClass =
  "flex-grow-0 flex-shrink-0 text-[15px] text-center text-[#f9f9f9] hover:underline";

export const PrivacyAndTerms: React.FC = () => {
  return (
    <div className="container flex-col lg:flex-row justify-between items-center gap-2 lg:gap-0 self-stretch relative pt-10 border-t border-r-0 border-b-0 border-l-0 border-white/20">
      <Link href="/privacy-policy" className={linkClass}>
        Privacy Policy
      </Link>
      <p className="flex-grow-0 flex-shrink-0 text-[15px] text-center text-[#f9f9f9]">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </p>
      <Link href="/terms-of-use" className={linkClass}>
        Terms of Use
      </Link>
    </div>
  );
};
