import './globals.css';

import type { Metadata } from 'next';

import { Footer } from '@/components/layout/footer/Footer';
import { Header } from '@/components/layout/Header';
import fixelDisplay from '@/fonts/fixelDisplay';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/utils/site';

const TITLE = 'Web41 Agency — Fast, Modern Websites for Small Businesses';
const DESC =
  'We rebuild slow, outdated business websites on Next.js — pages that load ' +
  'instantly on mobile, rank higher in Google, and are easy to update without a developer.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // Without this, the canonical images URL will be wrong
  title: {
    default: TITLE,
    template: '%s | Web41 Agency', // SubPages: "Portfolio | Web41 Agency"
  },
  description: DESC,
  applicationName: SITE_NAME,
  // NOTE: no `alternates.canonical` here on purpose.
  // A canonical set on the root layout is inherited by EVERY page, which told
  // Google that /portfolio, /about-us etc. were duplicates of the homepage.
  // Each page declares its own canonical instead.
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESC,
    locale: 'en_US',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'Web41 Agency — web development studio' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
};

// This is the only entity data Google can currently verify for this brand.
// NOT included: `address` and a Freelancehunt `sameAs` entry — the codebase
// has no real physical address or Freelancehunt profile URL, and shipping a
// placeholder in structured data (unlike page copy) creates a false/broken
// NAP or link that actively undermines the disambiguation this schema exists
// for. TODO(content): add both once available.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  email: CONTACT_EMAIL,
  sameAs: ['https://www.instagram.com/web41.agency/', 'https://www.dribbble.com/web41'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fixelDisplay.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div className="flex flex-col justify-between items-center w-full min-h-screen pt-4 bg-white overflow-x-hidden">
          <div className="relative w-full">
            <div className="sticky top-4 left-0 right-0 z-100">
              <Header />
            </div>
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
