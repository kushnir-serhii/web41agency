import { CONTACT_EMAIL } from '@/utils/site';

interface ChatEmailLinkProps {
  children?: React.ReactNode;
}

export const ChatEmailLink: React.FC<ChatEmailLinkProps> = ({ children = CONTACT_EMAIL }) => (
  <a
    href={`mailto:${CONTACT_EMAIL}`}
    className="inline-flex min-h-11 items-center font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
  >
    {children}
  </a>
);
