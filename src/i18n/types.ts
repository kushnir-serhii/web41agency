import type en from '../../messages/en.json';
import type { routing } from './routing';

export type Locale = (typeof routing.locales)[number];

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof en;
  }
}
