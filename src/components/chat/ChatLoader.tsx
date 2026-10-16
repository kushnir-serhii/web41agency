'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const IDLE_FALLBACK_MS = 2000;

const ChatWidget = dynamic(() => import('./ChatWidget').then((m) => m.ChatWidget), {
  ssr: false,
});

export function ChatLoader() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const show = () => setIsReady(true);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(show, { timeout: IDLE_FALLBACK_MS });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(show, IDLE_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, []);

  return isReady ? <ChatWidget /> : null;
}
