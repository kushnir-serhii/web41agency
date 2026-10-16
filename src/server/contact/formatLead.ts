import 'server-only';

export interface ILeadInput {
  name: string;
  email: string;
  message: string;
  locale: 'en' | 'uk';
  page: string;
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * The request carries a locale-less `page` plus `locale`. Show the URL as the visitor saw it:
 * Ukrainian pages live under `/uk`, English (default locale) has no prefix.
 */
const toDisplayPage = (locale: ILeadInput['locale'], page: string): string => {
  if (locale !== 'uk') return page;
  return `/uk${page === '/' ? '' : page}`;
};

/** Pure: builds the Telegram HTML text. Every user-supplied field is HTML-escaped. */
export function formatLead({ name, email, message, locale, page }: ILeadInput): string {
  const trimmedMessage = message.trim();
  return [
    '🆕 New lead — Web41',
    `Name: ${escapeHtml(name)}`,
    `Email: ${escapeHtml(email)}`,
    `Language: ${locale === 'uk' ? 'Ukrainian' : 'English'}`,
    `Page: ${escapeHtml(toDisplayPage(locale, page))}`,
    'Message:',
    trimmedMessage ? escapeHtml(trimmedMessage) : '—',
  ].join('\n');
}
