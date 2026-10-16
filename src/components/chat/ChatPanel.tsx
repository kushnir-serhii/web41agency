'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatDisclaimer } from '@/components/chat/ChatDisclaimer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatLongNote } from '@/components/chat/ChatLongNote';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import type { ChatStatus, IChatMessage } from '@/components/chat/types';
import { useBodyScrollLock } from '@/components/chat/useBodyScrollLock';
import { useFocusTrap } from '@/components/chat/useFocusTrap';
import { useIsMobile } from '@/components/chat/useIsMobile';
import { useVisualViewportHeight } from '@/components/chat/useVisualViewportHeight';

export const CHAT_PANEL_ID = 'chat-panel';

interface ChatPanelProps {
  messages: IChatMessage[];
  status: ChatStatus;
  announcement: string;
  isLong: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onRetry: () => void;
  onReset: () => void;
  onClose: () => void;
  onNavigate: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  status,
  announcement,
  isLong,
  onSend,
  onStop,
  onRetry,
  onReset,
  onClose,
  onNavigate,
}) => {
  const t = useTranslations('Chat');
  const shouldReduceMotion = useReducedMotion();
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useBodyScrollLock(isMobile);
  useFocusTrap(panelRef, isMobile);
  useVisualViewportHeight(panelRef, isMobile);

  // The panel is mounted only while open, so mounting == opening.
  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  const isStreaming = status === 'streaming';
  const isComposerDisabled = isLong || status === 'limited';
  const hidden = shouldReduceMotion ? false : { opacity: 0, y: 8 };

  return (
    <motion.div
      ref={panelRef}
      id={CHAT_PANEL_ID}
      role="dialog"
      aria-modal={isMobile}
      aria-label={t('title')}
      initial={hidden}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
      className="fixed inset-0 z-[110] flex h-[var(--chat-vh,100dvh)] flex-col overflow-hidden bg-white shadow-chat lg:inset-auto lg:bottom-20 lg:right-4 lg:z-50 lg:h-[min(560px,calc(100dvh-6rem))] lg:w-[380px] lg:rounded-3xl print:hidden"
    >
      <ChatHeader onClose={onClose} onStartOver={onReset} canStartOver={messages.length > 0} />
      <ChatMessageList
        messages={messages}
        status={status}
        onSend={onSend}
        onRetry={onRetry}
        onNavigate={onNavigate}
      />
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {isLong && <ChatLongNote onStartOver={onReset} onNavigate={onNavigate} />}
      <ChatComposer
        ref={messageRef}
        isStreaming={isStreaming}
        isDisabled={isComposerDisabled}
        onSend={onSend}
        onStop={onStop}
      />
      <ChatDisclaimer />
    </motion.div>
  );
};
