'use client';

import { useTranslations } from 'next-intl';
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';

import { ChatSendButton } from '@/components/chat/ChatSendButton';
import { CHAT_LIMITS } from '@/consts/chat';

interface ChatComposerProps {
  isStreaming: boolean;
  isDisabled?: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

const LINE_HEIGHT = 24;
const MAX_LINES = 4;

export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(
  ({ isStreaming, isDisabled = false, onSend, onStop }, forwardedRef) => {
    const t = useTranslations('Chat');
    const [value, setValue] = useState('');
    const [isMulti, setIsMulti] = useState(false);
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const isEmpty = value.trim().length === 0;

    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, LINE_HEIGHT * MAX_LINES)}px`;
      setIsMulti(el.scrollHeight > LINE_HEIGHT + 1);
    }, [value]);

    const submit = () => {
      if (isEmpty || isStreaming || isDisabled) return;
      onSend(value);
      setValue('');
    };

    const setRefs = (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    return (
      <div className="p-3">
        <div
          className={`flex items-end gap-2 bg-bg_item focus-within:ring-2 focus-within:ring-black py-1 pr-1 pl-4 ${isMulti ? 'rounded-3xl' : 'rounded-full'}`}
        >
          <label htmlFor="chat-message" className="sr-only">
            {t('composerLabel')}
          </label>
          <textarea
            id="chat-message"
            ref={setRefs}
            rows={1}
            value={value}
            disabled={isDisabled}
            maxLength={CHAT_LIMITS.userMaxChars}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
              e.preventDefault();
              submit();
            }}
            className="min-h-11 flex-1 resize-none bg-transparent py-2.5 disabled:opacity-40 text-base leading-6 focus-visible:outline-none"
          />
          <ChatSendButton
            isStreaming={isStreaming}
            isEmpty={isEmpty || isDisabled}
            onSend={submit}
            onStop={onStop}
          />
        </div>
        {value.length >= CHAT_LIMITS.counterFrom && (
          <p className="mt-1 pr-2 text-right text-xs text-muted_text">
            {value.length} / {CHAT_LIMITS.userMaxChars}
          </p>
        )}
      </div>
    );
  },
);
ChatComposer.displayName = 'ChatComposer';
