'use client';

import { useTranslations } from 'next-intl';
import { Fragment, useEffect, useRef } from 'react';

import { ChatErrorNotice } from '@/components/chat/ChatErrorNotice';
import { ChatHandoff } from '@/components/chat/ChatHandoff';
import { ChatLimitNotice } from '@/components/chat/ChatLimitNotice';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatSuggestions } from '@/components/chat/ChatSuggestions';
import { ChatTyping } from '@/components/chat/ChatTyping';
import type { ChatStatus, IChatMessage } from '@/components/chat/types';

interface ChatMessageListProps {
  messages: IChatMessage[];
  status: ChatStatus;
  onSend: (text: string) => void;
  onRetry: () => void;
  onNavigate: () => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  status,
  onSend,
  onRetry,
  onNavigate,
}) => {
  const t = useTranslations('Chat');
  const isStreaming = status === 'streaming';
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, status]);

  return (
    <div
      role="log"
      aria-live="off"
      aria-label={t('title')}
      className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-3"
    >
      {messages.length === 0 && (
        <>
          <ChatMessage variant="bot" content={t('greeting')} />
          <ChatSuggestions onSelect={onSend} />
        </>
      )}
      {messages.map((m) => {
        if (m.role === 'assistant' && !m.content) {
          return isStreaming ? <ChatTyping key={m.id} /> : null;
        }
        return (
          <Fragment key={m.id}>
            <ChatMessage variant={m.role === 'user' ? 'user' : 'bot'} content={m.content} />
            {m.handoff && <ChatHandoff onNavigate={onNavigate} />}
          </Fragment>
        );
      })}
      {status === 'error' && <ChatErrorNotice onRetry={onRetry} />}
      {status === 'limited' && <ChatLimitNotice />}
      <div ref={endRef} />
    </div>
  );
};
