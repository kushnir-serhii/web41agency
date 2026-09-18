// TODO(legal): generic template — review before relying on it
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/utils/site';
import type { LegalDocument } from './types';

export const termsOfUse: LegalDocument = {
  title: 'Terms of Use',
  description: `The terms that apply when you use the ${SITE_NAME} website.`,
  lastUpdated: 'September 18, 2026',
  intro: [
    `These Terms of Use apply to your use of ${SITE_URL} (the "Site"), which ${SITE_NAME} ("we", "us") operates. By using the Site you agree to these terms. If you do not agree, please do not use the Site.`,
  ],
  sections: [
    {
      heading: 'Use of the Site',
      paragraphs: [
        'You may browse the Site and contact us for personal or business purposes. You agree not to:',
      ],
      list: [
        'use the Site in a way that breaks any law;',
        'try to gain unauthorised access to the Site or the systems behind it;',
        'send spam, malware or misleading information through the contact form;',
        'copy or scrape the Site content in bulk.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        `The Site design, text, graphics and logos belong to ${SITE_NAME} or its licensors and are protected by copyright and other laws. You may not reuse them without our written permission.`,
      ],
    },
    {
      heading: 'Portfolio and client work',
      paragraphs: [
        'The portfolio shows work we have done for our clients, published with their permission. Client names, logos, trademarks and materials remain the property of their owners. Showing them does not mean that a client endorses the Site or these terms.',
      ],
    },
    {
      heading: 'Information on the Site',
      paragraphs: [
        'The content of the Site, including prices and timelines, is general information only and is not an offer. We agree the final scope, price and terms of any project with you separately, in writing.',
      ],
    },
    {
      heading: 'No warranty',
      paragraphs: [
        'The Site is provided "as is" and "as available". We do our best to keep it accurate and online, but we do not guarantee that it is error-free, complete or always available.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        `To the extent the law allows, ${SITE_NAME} is not liable for any indirect or consequential loss, or for any loss of data, profit or business, that arises from your use of the Site. Nothing in these terms limits any liability that cannot be limited by law.`,
      ],
    },
    {
      heading: 'External links',
      paragraphs: [
        'The Site links to third-party websites, such as our social media profiles and client websites. We do not control those sites and are not responsible for their content or privacy practices.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        // TODO(owner): jurisdiction. Name the country (and courts) whose law governs these terms.
        'These terms are governed by the laws of the jurisdiction in which we are established. The competent courts of that jurisdiction will handle any dispute, unless the law of your country of residence requires otherwise.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`If you have any questions about these terms, email us at ${CONTACT_EMAIL}.`],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: [
        'We may update these terms from time to time. The "Last updated" date at the top shows when they last changed. If you keep using the Site after a change, you accept the updated terms.',
      ],
    },
  ],
};
