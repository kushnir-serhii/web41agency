/**
 * Single source of truth for the site's public origin.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel once web41agency.com is pointed at the
 * deployment. Everything else (canonical, OG, sitemap, robots) follows from here.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || 'https://web41agency.vercel.app';

export const SITE_NAME = 'Web41 Agency';

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'hello@web41.agency';
