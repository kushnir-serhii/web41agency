'use client';

import './globals.css';

import Link from 'next/link';

import fixelDisplay from '@/fonts/fixelDisplay';

import messages from '../../messages/en.json';

const { heading, text, retry, backHome } = messages.Error;

// Last resort when the locale layout itself fails: no intl provider exists here, so it is
// English-only, like the root not-found page. Route-level errors use [locale]/error.tsx.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  const buttonClass =
    'flex justify-center items-center h-14 px-6 rounded-full text-lg font-bold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black';

  return (
    <html lang="en">
      <body className={fixelDisplay.className}>
        <main role="alert" className="container flex-col items-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">{heading}</h1>
          <p className="text-muted_text max-w-xl text-lg">{text}</p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button type="button" onClick={reset} className={`${buttonClass} bg-black text-white`}>
              {retry}
            </button>
            <Link href="/" className={`${buttonClass} text-black`}>
              {backHome}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
