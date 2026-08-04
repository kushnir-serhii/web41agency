import { PrivacyAndTerms } from "./footerComponents/PrivacyAndTerms";
import { SocialList } from "./footerComponents/SocialList";
import { Logo } from "../../ui/Logo";
import { NavBar } from "../navBar/NavBar";

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col gap-10 h-full w-full py-10 lg:py-14 bg-black">
      <div className="container h-full flex-col lg:flex-row justify-between items-center gap-10">
        <Logo
          widthIcon={196}
          heightIcon={196}
          color={"text-white"}
          fontSize={"text-6xl lg:text-9xl"}
          iconClassName="w-[110px] lg:w-[196px] h-auto"
        />
        <NavBar isFooter />
        <SocialList />
      </div>
      <PrivacyAndTerms />
    </footer>
  );
};
