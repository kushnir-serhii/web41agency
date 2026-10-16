'use client';

import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { ChatLauncher } from '@/components/chat/ChatLauncher';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ChatTeaser } from '@/components/chat/ChatTeaser';
import { useChat } from '@/components/chat/useChat';
import { useChatTeaser } from '@/components/chat/useChatTeaser';
import { useFormInView } from '@/components/chat/useFormInView';
import { useIsMobile } from '@/components/chat/useIsMobile';
import { trackEvent } from '@/utils/analytics';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, status, announcement, isLong, send, stop, retry, reset } = useChat();
  const teaser = useChatTeaser(isOpen);
  const isMobile = useIsMobile();
  const isFormInView = useFormInView(isMobile);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    // Flush so the launcher (hidden while open on mobile) is visible before it takes focus.
    flushSync(() => setIsOpen(false));
    if (isFormInView) {
      // Launcher is hidden next to the form; fall back to the form section.
      document.getElementById('lets-talk')?.focus({ preventScroll: true });
      return;
    }
    launcherRef.current?.focus();
  }, [isFormInView]);

  const closeWithoutFocus = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            messages={messages}
            status={status}
            announcement={announcement}
            isLong={isLong}
            onSend={send}
            onStop={stop}
            onRetry={retry}
            onReset={reset}
            onClose={close}
            onNavigate={closeWithoutFocus}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {teaser.isVisible && !isOpen && !isFormInView && (
          <ChatTeaser
            onOpen={() => {
              teaser.hide();
              setIsOpen(true);
              trackEvent({ name: 'chat_open', props: { source: 'teaser' } });
            }}
            onDismiss={teaser.hide}
          />
        )}
      </AnimatePresence>
      <ChatLauncher
        ref={launcherRef}
        isOpen={isOpen}
        isAvoiding={isFormInView}
        onClick={() => {
          if (isOpen) {
            close();
            return;
          }
          setIsOpen(true);
          trackEvent({ name: 'chat_open', props: { source: 'launcher' } });
        }}
      />
    </>
  );
};
