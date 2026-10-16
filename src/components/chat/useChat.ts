'use client';

import { useLocale } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { loadMessages, saveMessages } from '@/components/chat/chatStorage';
import { splitHandoff } from '@/components/chat/splitHandoff';
import type { ChatStatus, IChatMessage } from '@/components/chat/types';
import { CHAT_LIMITS } from '@/consts/chat';

export interface IUseChat {
  messages: IChatMessage[];
  status: ChatStatus;
  isLong: boolean;
  announcement: string;
  send: (text: string) => void;
  stop: () => void;
  retry: () => void;
  reset: () => void;
}

const toPlainText = (md: string): string =>
  md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const newId = (): string => crypto.randomUUID();

export function useChat(): IUseChat {
  const locale = useLocale();
  // Client-only widget (next/dynamic ssr:false), so reading sessionStorage at init is hydration-safe.
  const [initial] = useState<IChatMessage[]>(loadMessages);
  const [messages, setMessages] = useState<IChatMessage[]>(initial);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [announcement, setAnnouncement] = useState('');

  const messagesRef = useRef<IChatMessage[]>(initial);
  const statusRef = useRef<ChatStatus>('idle');
  const abortRef = useRef<AbortController | null>(null);
  const rawRef = useRef('');
  const frameRef = useRef<number | null>(null);

  const commitMessages = useCallback((next: IChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const changeStatus = useCallback((next: ChatStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const cancelFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const writeAssistant = useCallback(
    (id: string, final: boolean) => {
      const { text, handoff } = splitHandoff(rawRef.current, { final });
      commitMessages(
        messagesRef.current.map((m) =>
          m.id === id ? { ...m, content: text, ...(final && handoff ? { handoff: true } : {}) } : m,
        ),
      );
    },
    [commitMessages],
  );

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || statusRef.current === 'streaming' || statusRef.current === 'limited') return;

      const assistantId = newId();
      const history: IChatMessage[] = [
        ...messagesRef.current,
        { id: newId(), role: 'user', content },
      ];
      commitMessages([...history, { id: assistantId, role: 'assistant', content: '' }]);
      changeStatus('streaming');
      rawRef.current = '';
      setAnnouncement('');

      const controller = new AbortController();
      abortRef.current = controller;

      const dropEmptyAssistant = () =>
        commitMessages(messagesRef.current.filter((m) => m.id !== assistantId || m.content));

      const fail = (next: ChatStatus) => {
        cancelFrame();
        dropEmptyAssistant();
        changeStatus(next);
      };

      const run = async () => {
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              locale,
              messages: history.map(({ role, content: c }) => ({ role, content: c })),
            }),
            signal: controller.signal,
          });
          if (!res.ok || !res.body) {
            fail(res.status === 429 ? 'limited' : 'error');
            return;
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          const flush = () => {
            frameRef.current = null;
            writeAssistant(assistantId, false);
          };

          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            rawRef.current += decoder.decode(value, { stream: true });
            if (frameRef.current === null) frameRef.current = requestAnimationFrame(flush);
          }
          rawRef.current += decoder.decode();

          cancelFrame();
          if (!splitHandoff(rawRef.current, { final: true }).text) {
            fail('error');
            return;
          }
          writeAssistant(assistantId, true);
          saveMessages(messagesRef.current);
          changeStatus('idle');
          setAnnouncement(toPlainText(splitHandoff(rawRef.current, { final: true }).text));
        } catch (error: unknown) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            if (abortRef.current !== controller) return; // superseded by reset()
            cancelFrame();
            writeAssistant(assistantId, true);
            dropEmptyAssistant();
            saveMessages(messagesRef.current);
            changeStatus('idle');
            return;
          }
          fail('error');
        } finally {
          if (abortRef.current === controller) abortRef.current = null;
        }
      };
      void run();
    },
    [cancelFrame, changeStatus, commitMessages, locale, writeAssistant],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    const controller = abortRef.current;
    abortRef.current = null;
    controller?.abort();
    cancelFrame();
    rawRef.current = '';
    commitMessages([]);
    setAnnouncement('');
    saveMessages([]);
    changeStatus('idle');
  }, [cancelFrame, changeStatus, commitMessages]);

  const retry = useCallback(() => {
    if (statusRef.current !== 'error') return;
    const list = [...messagesRef.current];
    if (list[list.length - 1]?.role === 'assistant') list.pop();
    const last = list[list.length - 1];
    if (!last || last.role !== 'user') return;
    commitMessages(list.slice(0, -1));
    changeStatus('idle');
    send(last.content);
  }, [changeStatus, commitMessages, send]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      cancelFrame();
    },
    [cancelFrame],
  );

  return {
    messages,
    status,
    announcement,
    isLong: messages.length >= CHAT_LIMITS.maxMessages,
    send,
    stop,
    retry,
    reset,
  };
}
