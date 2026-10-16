// TODO(legal): generic template — review before relying on it
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/utils/site';

import type { LegalDocument } from './types';

// TODO(legal): the contact form does not send data anywhere yet (LetsTalk.handleSubmit
// only logs). This policy describes the intended behaviour: the form emails the name,
// email and message to us. Check this text again once the form backend and email
// provider exist, and name that provider under "Who we share data with".
export const privacyPolicy: LegalDocument = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} collects, uses and protects the personal data you share through our website.`,
  lastUpdated: '2026-10-14',
  summary: [
    'We only collect what you send us through the form, the chat assistant or by email.',
    'No tracking or advertising cookies.',
    'We never sell your data.',
    'Ask us anytime to see or delete your data.',
  ],
  intro: [
    `This Privacy Policy explains what personal data ${SITE_NAME} ("we", "us") collects when you visit ${SITE_URL} (the "Site") or contact us, why we collect it, and what rights you have.`,
  ],
  sections: [
    {
      heading: 'What we collect',
      paragraphs: [
        'We only collect the data you choose to give us, plus the technical data needed to deliver the Site:',
      ],
      list: [
        'Contact form: your name, email address and the message you write.',
        'Email: if you write to us directly, your email address and the content of your message.',
        'Chat assistant: the messages you type into the chat on the Site. See "Chat assistant" below.',
        'Server logs: our hosting provider automatically processes technical data such as your IP address, browser type and the pages you request, to deliver the Site and keep it secure.',
      ],
    },
    {
      heading: 'Cookies and analytics',
      paragraphs: [
        'The Site does not use advertising or tracking cookies. Fonts are served from our own domain.',
        'We use Vercel Web Analytics to count page visits and a few anonymous actions, such as sending the contact form or clicking our email address. It does not use cookies, does not track you across other websites, and does not record your name, email or message. Visitors are identified only by a hash of the request that is discarded after 24 hours, so we see totals rather than individual people.',
      ],
    },
    {
      heading: 'Chat assistant',
      paragraphs: [
        'The Site has an AI chat assistant. The messages you type are sent to OpenAI, our AI provider, only to generate the reply. OpenAI processes them under its API terms.',
        'We do not store chat conversations on our servers. The conversation stays in your browser tab only while that tab is open, and is cleared when you close the tab or choose "Start over". Once your visit ends, it is gone.',
        'To prevent abuse, our server keeps a short-lived count of requests per IP address in memory, for up to 24 hours.',
        'Please do not share passwords, card numbers or other sensitive information in the chat.',
      ],
    },
    {
      heading: 'Why we use your data',
      list: [
        'To reply to your enquiry and discuss your project.',
        'To prepare quotes and, if we work together, to deliver the agreed services.',
        'To keep the Site running, secure and free of abuse.',
      ],
    },
    {
      heading: 'Legal basis',
      paragraphs: [
        'If you are in the European Economic Area or the UK, we process your data under the GDPR on the following bases:',
      ],
      list: [
        'Consent: when you submit the contact form. You can withdraw your consent at any time by emailing us.',
        'Legitimate interest: to answer enquiries you send us and to keep the Site secure.',
        'Contract: when the data is needed to prepare or carry out an agreement with you.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        // TODO(owner): confirm the retention period.
        'We keep enquiry messages for as long as we need them to handle your request, and for up to 24 months afterwards. If we start working together, we keep project correspondence for as long as the law requires. Our hosting provider keeps server logs for a short, limited period.',
      ],
    },
    {
      heading: 'Who we share data with',
      paragraphs: [
        'We do not sell your personal data. We share it only with the service providers that help us run the Site:',
      ],
      list: [
        'Vercel Inc., which hosts the Site and provides our privacy-friendly analytics. Vercel may process data outside your country, including in the United States, under appropriate safeguards.',
        'OpenAI, which generates the replies of our chat assistant from the messages you send in the chat.',
        'Our email provider, so that we can receive and answer your messages.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: ['Depending on where you live, you have the right to:'],
      list: [
        'access the personal data we hold about you;',
        'ask us to correct or delete it;',
        'object to or restrict how we process it;',
        'withdraw your consent at any time;',
        'complain to your local data protection authority.',
      ],
    },
    {
      heading: 'How we protect your data',
      paragraphs: [
        'The Site uses a secure (HTTPS) connection. Only the Web41 team can see the enquiries you send us, and we work with well-known, reputable service providers.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'The Site is not aimed at children under 16, and we do not knowingly collect their personal data. If you believe a child has sent us their data, email us and we will delete it.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        `To use any of these rights, or to ask a question about this policy, email us at ${CONTACT_EMAIL}. We aim to reply within 30 days.`,
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy from time to time. The "Last updated" date at the top shows when it last changed.',
      ],
    },
  ],
};
