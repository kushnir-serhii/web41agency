// Shared by the client and the server: must have no dependencies.

export type Locale = 'en' | 'uk';

export interface ILocaleOption {
  readonly locale: Locale;
  readonly short: 'EN' | 'UK';
  readonly endonym: 'English' | 'Українська';
}

export const LOCALE_OPTIONS = [
  { locale: 'en', short: 'EN', endonym: 'English' },
  { locale: 'uk', short: 'UK', endonym: 'Українська' },
] as const satisfies readonly ILocaleOption[];
