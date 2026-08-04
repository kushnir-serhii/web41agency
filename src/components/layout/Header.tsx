"use client";

import { NavBar } from "@/components/layout/navBar/NavBar";
import { NavBarItem } from "@/components/layout/navBar/NavBarItem";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { navBarArray } from "@/content/navBarArray";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative w-full px-2 lg:px-20 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-center max-w-[1280px] w-full mx-auto pl-4 pr-2 py-2 rounded-[100px] bg-bg_header/30 backdrop-blur-[100px]">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:block lg:max-w-[670px] w-full xl:max-w-[793px]">
          <NavBar />
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="lg:hidden flex items-center justify-center"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? (
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Icon id="icon-cross" width={14} height={14} />
            </div>
          ) : (
            <Icon id="icon-icon-menu" width={40} height={40} />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden absolute top-full left-2 right-2 mt-2 z-50 rounded-3xl bg-white/90 backdrop-blur-[100px] shadow-xl overflow-hidden"
          >
            <ul className="flex flex-col py-4">
              {navBarArray.map(({ href, label }, index) => (
                <li key={index} onClick={() => setIsOpen(false)}>
                  <NavBarItem
                    link={href}
                    text={label}
                    isActive={pathname === href}
                  />
                </li>
              ))}
              <li className="px-4 pt-2">
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-3 rounded-[100px] text-white bg-black"
                >
                  Free Quote
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
