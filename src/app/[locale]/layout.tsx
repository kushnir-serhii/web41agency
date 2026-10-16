import '../globals.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { ChatLoader } from '@/components/chat/ChatLoader';
import { Footer } from '@/components/layout/footer/Footer';
import { Header } from '@/components/layout/Header';
import fixelDisplay from '@/fonts/fixelDisplay';
import { localeUrl, OG_LOCALES } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/types';
import { CONTACT_EMAIL, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/utils/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Meta.default' });
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(SITE_URL), // Without this, the canonical images URL will be wrong
    title: {
      default: title,
      template: '%s | Web41 Agency', // SubPages: "Portfolio | Web41 Agency"
    },
    description,
    applicationName: SITE_NAME,
    // NOTE: no `alternates` here on purpose.
    // A canonical set on the root layout is inherited by EVERY page, which told
    // Google that /portfolio, /about-us etc. were duplicates of the homepage.
    // Each page declares its own canonical + hreflang via buildPageMetadata.
    openGraph: {
      type: 'website',
      url: localeUrl(locale, '/'),
      siteName: SITE_NAME,
      title,
      description,
      locale: OG_LOCALES[locale],
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
  };
}

// This is the only entity data Google can currently verify for this brand.
// NOT included: `address` and a Freelancehunt `sameAs` entry — the codebase
// has no real physical address or Freelancehunt profile URL, and shipping a
// placeholder in structured data (unlike page copy) creates a false/broken
// NAP or link that actively undermines the disambiguation this schema exists
// for. TODO(content): add both once available.
const buildOrganizationJsonLd = (locale: Locale, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: localeUrl(locale, '/'),
  description,
  inLanguage: locale,
  logo: `${SITE_URL}/favicon.png`,
  email: CONTACT_EMAIL,
  sameAs: ['https://www.instagram.com/web41.agency/', 'https://www.dribbble.com/web41'],
});

// Only these namespaces reach the client bundle; legal and page copy stay server-side.
const CLIENT_NAMESPACES = [
  'Header',
  'Nav',
  'Cta',
  'LanguageSwitcher',
  'Services',
  'Common',
  'LetsTalk',
  'Chat',
] as const;

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const tMeta = await getTranslations({ locale, namespace: 'Meta.default' });
  const organizationJsonLd = buildOrganizationJsonLd(locale, tMeta('description'));
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );

  return (
    <html lang={locale}>
      <body className={fixelDisplay.className}>
        <NextIntlClientProvider messages={clientMessages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd).replace(/</g, '\u003c'),
            }}
          />
          <div className="flex flex-col justify-between items-center w-full min-h-screen pt-4 bg-white overflow-x-clip">
            <div className="relative w-full">
              <div className="sticky top-4 left-0 right-0 z-100 print:hidden">
                <Header />
              </div>
              {children}
            </div>
            <div className="print:hidden w-full">
              <Footer />
            </div>
          </div>
          {process.env.NEXT_PUBLIC_CHAT_ENABLED === 'true' && <ChatLoader />}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
