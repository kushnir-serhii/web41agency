import { Link } from '@/i18n/navigation';

interface NavBarItemProps {
  link: string;
  text: string;
  isFooter?: boolean;
  isActive: boolean;
}
export const NavBarItem: React.FC<NavBarItemProps> = ({ link, text, isActive, isFooter }) => {
  return (
    <Link
      href={link}
      className={`group flex justify-center items-center gap-2 text-base  transition-colors duration-200 ease-in-out
          min-h-11 py-2 ${isFooter ? 'px-4 text-white hover:text-accent' : 'px-1 xl:px-4 text-graphite hover:text-black'}`}
    >
      <div
        className={`size-2 rounded-full transition-all duration-200  ${
          isActive
            ? `flex ${isFooter ? 'bg-white group-hover:bg-accent' : 'bg-graphite group-hover:bg-black'}`
            : 'bg-transparent'
        }`}
      />
      <span className={`flex items-center justify-center`}>{text}</span>
    </Link>
  );
};
