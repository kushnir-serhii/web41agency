import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* Playwright points this at .next-e2e so e2e runs never clobber a developer's dev server output. */
  distDir: process.env.NEXT_DIST_DIR || '.next',
  redirects: async () => [
    /* The old placeholder case showed the same project, now published as a full case study. */
    {
      source: '/portfolio/saas-landing-page',
      destination: '/portfolio/investico',
      permanent: true,
    },
    {
      source: '/uk/portfolio/saas-landing-page',
      destination: '/uk/portfolio/investico',
      permanent: true,
    },
  ],
};

export default withNextIntl(nextConfig);
