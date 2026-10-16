import 'server-only';

import type { Locale } from '@/i18n/types';

export const CONTACT_LIMITS = {
  nameMaxChars: 100,
  emailMaxChars: 200,
  messageMaxChars: 2000,
  pageMaxChars: 200,
} as const;

export interface IContactData {
  name: string;
  email: string;
  message: string;
  locale: Locale;
  page: string;
}

export interface IContactFieldErrors {
  name?: 'required';
  email?: 'required' | 'invalid';
}

/**
 * Result shape (same idea as chat: no error detail beyond codes).
 * - `validation`: only name/email problems, which the client maps to field
 *   errors. Empty after trim -> 'required'; email over the limit or badly
 *   formatted -> 'invalid'.
 * - `invalid_request`: wrong types, non-object body, unknown locale, and
 *   over-long name/message/page. The form enforces maxLength, so only tampered
 *   requests reach these, and the client has no field message for them.
 * - `honeypot`: true when the hidden `website` field is filled; the route
 *   answers 200 and sends nothing.
 */
export type ParseContactResult =
  | { ok: true; data: IContactData; honeypot: boolean }
  | { ok: false; error: 'validation'; fields: IContactFieldErrors }
  | { ok: false; error: 'invalid_request' };

const invalidRequest = { ok: false, error: 'invalid_request' } as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const locales: readonly Locale[] = ['en', 'uk'];

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value);

export function parseContactRequest(body: unknown): ParseContactResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return invalidRequest;
  const raw = body as Record<string, unknown>;

  const { name, email, message, locale, page, website } = raw;
  if (typeof name !== 'string' || typeof email !== 'string') return invalidRequest;
  if (message !== undefined && typeof message !== 'string') return invalidRequest;
  if (page !== undefined && typeof page !== 'string') return invalidRequest;
  if (website !== undefined && typeof website !== 'string') return invalidRequest;
  if (locale !== undefined && !isLocale(locale)) return invalidRequest;

  const data: IContactData = {
    name: name.trim(),
    email: email.trim(),
    message: (message ?? '').trim(),
    locale: locale ?? 'en',
    page: (page ?? '').trim(),
  };

  if (
    data.name.length > CONTACT_LIMITS.nameMaxChars ||
    data.message.length > CONTACT_LIMITS.messageMaxChars ||
    data.page.length > CONTACT_LIMITS.pageMaxChars
  ) {
    return invalidRequest;
  }

  const fields: IContactFieldErrors = {};
  if (data.name.length === 0) fields.name = 'required';
  if (data.email.length === 0) fields.email = 'required';
  else if (data.email.length > CONTACT_LIMITS.emailMaxChars || !emailPattern.test(data.email)) {
    fields.email = 'invalid';
  }
  if (fields.name || fields.email) return { ok: false, error: 'validation', fields };

  return { ok: true, data, honeypot: (website ?? '').trim().length > 0 };
}
