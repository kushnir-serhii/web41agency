import { useTranslations } from 'next-intl';

import { ChatEmailLink } from '@/components/chat/ChatEmailLink';

export const ChatDisclaimer: React.FC = () => {
  const t = useTranslations('Chat');
  return (
    <p className="flex shrink-0 flex-wrap items-center justify-center gap-x-1 px-4 text-xs text-black/70">
      <span>{t('disclaimer')}</span>
      <ChatEmailLink>{t('disclaimerLink')}</ChatEmailLink>
    </p>
  );
};
