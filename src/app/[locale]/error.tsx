'use client';

import { useEffect } from 'react';

import { ErrorContent } from '@/components/notFound';

// Catches render errors below the locale layout, so Header, Footer and the chat stay usable.
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console -- error class and digest only, no page data
    console.error('[page] render failed:', error.name, error.digest ?? '');
  }, [error]);

  return <ErrorContent onRetry={reset} />;
}
