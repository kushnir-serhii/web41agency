import { useTranslations } from 'next-intl';

import { ChatEmailLink } from '@/components/chat/ChatEmailLink';
import { ChatMessage } from '@/components/chat/ChatMessage';

export const ChatLimitNotice: React.FC = () => {
  const t = useTranslations('Chat');
  return (
    <ChatMessage variant="bot">
      <p role="status" className="text-base">
        {t('limit')} <ChatEmailLink />.
      </p>
    </ChatMessage>
  );
};
