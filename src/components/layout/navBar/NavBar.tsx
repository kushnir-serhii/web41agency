"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONSULTATION_HREF } from "@/content/ctaLinks";
import { navBarArray } from "@/content/navBarArray";
import { NavBarItem } from "./NavBarItem";

interface NavBarProps {
  children?: React.ReactNode;
  isFooter?: boolean;
}
export const NavBar: React.FC<NavBarProps> = ({ isFooter }) => {
  const pathName = usePathname();
  return (
    <ul
      className={`flex justify-between items-center ${
        isFooter ? "flex-col" : "w-full"
      }`}
    >
      {navBarArray.map(({ href, label }, index) => (
        <li key={index}>
          <NavBarItem
            link={href}
            text={label}
            isFooter={isFooter}
            isActive={pathName === href ? true : false}
          />
        </li>
      ))}
      {!isFooter && (
        <li>
          <Link
            href={CONSULTATION_HREF}
            className="flex justify-center items-center px-4 py-2 rounded-[100px] text-white bg-black"
          >
            Free Quote
          </Link>
        </li>
      )}
    </ul>
  );
};
