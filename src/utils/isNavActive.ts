// A nav link stays active on its nested routes too (e.g. /portfolio/[slug] keeps "Portfolio" lit).
export const isNavActive = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);
