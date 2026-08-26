import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/footer/Footer";
import fixelDisplay from "@/fonts/fixelDisplay";
import type { Metadata } from "next";
import "./globals.css";

//NEEDS TO BE CHANGED
const SITE = "https://web41agency.vercel.app";

const TITLE = "Web41 — Fast, Modern Websites for Small Businesses";
const DESC =
  "We rebuild slow, outdated business websites on Next.js — pages that load " +
  "instantly on mobile, rank higher in Google, and are easy to update without a developer.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),          // Without this, the canonical images URL will be wrong 
  title: {
    default: TITLE,
    template: "%s | Web41",             // SubPages: "Websites for Dental Practices | Web41"
  },
  description: DESC,
  applicationName: "Web41",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Web41",
    title: TITLE,
    description: DESC,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Web41 — web development studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body  className={fixelDisplay.className}>
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
