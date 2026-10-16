import { useTranslations } from 'next-intl';

import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { ChatIconButton } from '@/components/chat/ChatIconButton';

interface ChatHeaderProps {
  onClose: () => void;
  onStartOver: () => void;
  canStartOver: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onStartOver, canStartOver }) => {
  const t = useTranslations('Chat');
  return (
    <div className="flex items-center gap-3 bg-bg_header/30 py-2 pl-4 pr-2 backdrop-blur-[100px]">
      <ChatAvatar />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold leading-tight">{t('title')}</p>
        <p className="truncate text-sm text-muted_text">{t('subtitle')}</p>
      </div>
      <ChatIconButton
        icon="icon-refresh"
        label={t('startOver')}
        onClick={onStartOver}
        disabled={!canStartOver}
      />
      <ChatIconButton icon="icon-cross" label={t('closeLabel')} onClick={onClose} />
    </div>
  );
};
