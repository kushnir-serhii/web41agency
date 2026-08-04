import Link from "next/link";
import { Icon } from "./Icon";


interface LogoProps {
    widthIcon?: number;
    heightIcon?: number;
    color?: string;
    fontSize?: string;
    /* Tailwind sizing for the icon — wins over the width/height attributes,
       so the logo can scale per breakpoint. */
    iconClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  widthIcon = 30,
  heightIcon = 30,
  color = "text-black",
  fontSize = "text-[20px]",
  iconClassName = "",
}) => {
  return (
    <Link
      href="/"
      className={`flex justify-center items-center ${
        widthIcon === 30 ? "gap-2" : "gap-4 lg:gap-8"
      }`}
      aria-label="Logo link"
    >
      <Icon
        id="icon-logo"
        width={widthIcon}
        height={heightIcon}
        className={`${color} ${iconClassName}`}
      />
      <p className={`${fontSize} ${color}`}>web41</p>
    </Link>
  );
};