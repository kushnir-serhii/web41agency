// Shared by the client and the server: must have no dependencies.

export const HANDOFF_TOKEN = '[[HANDOFF]]';

export const CHAT_LIMITS = {
  maxMessages: 20,
  userMaxChars: 500,
  counterFrom: 400,
  assistantMaxChars: 4000,
  burst: { limit: 20, windowMs: 600_000 },
  daily: { limit: 60, windowMs: 86_400_000 },
  teaserDelayMs: 20_000,
} as const;

export const CHAT_STORAGE_KEYS = {
  messages: 'web41.chat.v1.messages',
  teaserShown: 'web41.chat.v1.teaserShown',
} as const;

/**
 * Reason in a 429 response body: `burst` (per-10-minute limit) or `daily` (per-day limit).
 * Other API error codes (invalid_request, rate_limited, unavailable, disabled) are the `error` field, not reasons.
 */
export type ChatErrorReason = 'burst' | 'daily';
