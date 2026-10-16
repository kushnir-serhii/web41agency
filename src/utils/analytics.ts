import { track } from '@vercel/analytics';

import type { Locale } from '@/i18n/types';

// Conversion events for Vercel Web Analytics. Custom events need a Vercel Pro plan;
// on Hobby only page views are recorded and these calls are ignored.
// Never pass personal data (name, email, message) in event properties.
type AnalyticsEvent =
  | { name: 'lead_form_submit'; props: { locale: Locale } }
  | {
      name: 'email_click';
      props: { location: 'lets_talk_link' | 'lets_talk_button'; locale: Locale };
    }
  | { name: 'chat_open'; props: { source: 'launcher' | 'teaser' } }
  | {
      name: 'chat_handoff_click';
      props: { location: 'handoff_card' | 'long_chat'; locale: Locale };
    };

// Analytics must never break the UI, so failures are swallowed.
export const trackEvent = ({ name, props }: AnalyticsEvent): void => {
  try {
    track(name, props);
  } catch {
    // ignore
  }
};
