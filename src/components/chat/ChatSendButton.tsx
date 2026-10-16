import { useTranslations } from 'next-intl';

import { Icon } from '@/components/ui/Icon';

interface ChatSendButtonProps {
  isStreaming: boolean;
  isEmpty: boolean;
  onSend: () => void;
  onStop: () => void;
}

export const ChatSendButton: React.FC<ChatSendButtonProps> = ({
  isStreaming,
  isEmpty,
  onSend,
  onStop,
}) => {
  const t = useTranslations('Chat');
  return (
    <button
      type="button"
      aria-label={isStreaming ? t('stop') : t('send')}
      onClick={isStreaming ? onStop : onSend}
      disabled={!isStreaming && isEmpty}
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-40"
    >
      <Icon id={isStreaming ? 'icon-stop' : 'icon-send'} width={20} height={20} />
    </button>
  );
};
