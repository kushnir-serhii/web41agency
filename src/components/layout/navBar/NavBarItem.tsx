import Link from "next/link";

interface NavBarItemProps {
  link: string;
  text: string;
  isFooter?: boolean;
  isActive: boolean;
}
export const NavBarItem: React.FC<NavBarItemProps> = ({
  link,
  text,
  isActive,
  isFooter,
}) => {
  return (
    <Link
      href={link}
      className={`group flex justify-center items-center gap-2 text-base  transition-all duration-200 easy-in-out
          px-4 py-2 ${
            isFooter
              ? "text-light_text"
              : "text-dark_text hover:text-dark_text-hover"
          }`}
    >
      <div
        className={`size-2 rounded-full transition-all duration-200  ${
          isActive
            ? `flex ${
                isFooter
                  ? "bg-light_text"
                  : "bg-dark_text group-hover:bg-dark_text-hover"
              }`
            : "bg-transparent"
        }`}
      />
      <span className={`flex items-center justify-center`}>{text}</span>
    </Link>
  );
};
