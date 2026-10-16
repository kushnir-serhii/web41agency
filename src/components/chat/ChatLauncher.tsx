import { useTranslations } from 'next-intl';

import { CHAT_PANEL_ID } from '@/components/chat/ChatPanel';
import { Icon } from '@/components/ui/Icon';

interface ChatLauncherProps {
  isOpen: boolean;
  isAvoiding?: boolean;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

export const ChatLauncher: React.FC<ChatLauncherProps> = ({
  isOpen,
  isAvoiding = false,
  onClick,
  ref,
}) => {
  const t = useTranslations('Chat');
  return (
    <button
      ref={ref}
      type="button"
      aria-label={isOpen ? t('closeLabel') : t('openLabel')}
      aria-expanded={isOpen}
      data-open={isOpen}
      data-avoiding={isAvoiding}
      aria-controls={CHAT_PANEL_ID}
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-accent text-black shadow-chat focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black print:hidden max-lg:data-[open=true]:hidden max-lg:data-[avoiding=true]:hidden [html[data-menu-open]_&]:hidden"
    >
      <Icon id={isOpen ? 'icon-cross' : 'icon-chat'} width={24} height={24} />
    </button>
  );
};
