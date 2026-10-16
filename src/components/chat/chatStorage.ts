import type { IChatMessage } from '@/components/chat/types';
import { CHAT_LIMITS, CHAT_STORAGE_KEYS } from '@/consts/chat';

const isMessage = (value: unknown): value is IChatMessage => {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.content === 'string' &&
    (m.role === 'user' || m.role === 'assistant') &&
    (m.handoff === undefined || typeof m.handoff === 'boolean')
  );
};

export function loadMessages(): IChatMessage[] {
  try {
    const raw = sessionStorage.getItem(CHAT_STORAGE_KEYS.messages);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return [];
    const { v, messages } = data as { v?: unknown; messages?: unknown };
    if (v !== 1 || !Array.isArray(messages) || !messages.every(isMessage)) return [];
    return messages.slice(0, CHAT_LIMITS.maxMessages);
  } catch {
    return [];
  }
}

export function saveMessages(messages: IChatMessage[]): void {
  try {
    if (messages.length === 0) {
      sessionStorage.removeItem(CHAT_STORAGE_KEYS.messages);
      return;
    }
    sessionStorage.setItem(CHAT_STORAGE_KEYS.messages, JSON.stringify({ v: 1, messages }));
  } catch {
    // storage unavailable: the conversation just won't survive a reload
  }
}

export function isTeaserShown(): boolean {
  try {
    return sessionStorage.getItem(CHAT_STORAGE_KEYS.teaserShown) === '1';
  } catch {
    return false;
  }
}

export function markTeaserShown(): void {
  try {
    sessionStorage.setItem(CHAT_STORAGE_KEYS.teaserShown, '1');
  } catch {
    // storage unavailable: the teaser may show again after a reload
  }
}
