import './globals.css';

import Link from 'next/link';

import fixelDisplay from '@/fonts/fixelDisplay';

import messages from '../../messages/en.json';

const { heading, text, backHome } = messages.NotFound;

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className={fixelDisplay.className}>
        <main className="container flex-col items-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">{heading}</h1>
          <p className="text-muted_text max-w-xl text-lg">{text}</p>
          <Link
            href="/"
            className="flex justify-center items-center h-14 px-6 rounded-full bg-black text-white text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {backHome}
          </Link>
        </main>
      </body>
    </html>
  );
}
