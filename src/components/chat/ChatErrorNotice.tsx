import { useTranslations } from 'next-intl';

import { ChatEmailLink } from '@/components/chat/ChatEmailLink';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Button } from '@/components/ui/Button';

interface ChatErrorNoticeProps {
  onRetry: () => void;
}

export const ChatErrorNotice: React.FC<ChatErrorNoticeProps> = ({ onRetry }) => {
  const t = useTranslations('Chat');
  return (
    <ChatMessage variant="error">
      <div role="alert" className="flex flex-col items-start gap-2 text-base">
        <p>
          {t('error')} <ChatEmailLink />.
        </p>
        <Button
          text={t('retry')}
          btnType="secondary"
          size="sm"
          className="border border-black"
          onClick={onRetry}
        />
      </div>
    </ChatMessage>
  );
};
