import 'server-only';

import { CHAT_LIMITS } from '@/consts/chat';
import type { Locale } from '@/i18n/types';

export type ChatRole = 'user' | 'assistant';

export interface IChatMessage {
  role: ChatRole;
  content: string;
}

export type ParseChatResult =
  { ok: true; messages: IChatMessage[]; locale: Locale } | { ok: false };

const maxChars: Record<ChatRole, number> = {
  user: CHAT_LIMITS.userMaxChars,
  assistant: CHAT_LIMITS.assistantMaxChars,
};

const isRole = (value: unknown): value is ChatRole => value === 'user' || value === 'assistant';

const isChatMessage = (value: unknown): value is IChatMessage => {
  if (typeof value !== 'object' || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  if (!isRole(role) || typeof content !== 'string') return false;
  return content.trim().length > 0 && content.length <= maxChars[role];
};

export function parseChatRequest(body: unknown): ParseChatResult {
  if (typeof body !== 'object' || body === null) return { ok: false };
  const { messages: raw, locale: rawLocale = 'en' } = body as Record<string, unknown>;
  if (rawLocale !== 'en' && rawLocale !== 'uk') return { ok: false };
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > CHAT_LIMITS.maxMessages) {
    return { ok: false };
  }
  if (!raw.every(isChatMessage)) return { ok: false };
  const messages = raw.map(({ role, content }) => ({ role, content }));
  if (messages[messages.length - 1].role !== 'user') return { ok: false };
  return { ok: true, messages, locale: rawLocale };
}
