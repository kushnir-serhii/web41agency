'use client';

import { useTranslations } from 'next-intl';

import { useHandoffNavigate } from '@/components/chat/useHandoffNavigate';
import { Button } from '@/components/ui/Button';
import { CONSULTATION_HREF } from '@/content/ctaLinks';

interface ChatLongNoteProps {
  onStartOver: () => void;
  onNavigate: () => void;
}

export const ChatLongNote: React.FC<ChatLongNoteProps> = ({ onStartOver, onNavigate }) => {
  const t = useTranslations('Chat');
  const tCta = useTranslations('Cta');
  const handleClick = useHandoffNavigate(onNavigate, 'long_chat');
  return (
    <div className="flex flex-col gap-3 bg-bg_item px-4 py-3">
      <p className="text-base">{t('longChat')}</p>
      <div className="flex flex-wrap gap-2">
        <Button
          text={tCta('freeQuote')}
          btnType="accent"
          size="sm"
          href={`/${CONSULTATION_HREF}`}
          onClick={handleClick}
        />
        <Button
          text={t('startOver')}
          btnType="secondary"
          size="sm"
          className="border border-black"
          onClick={onStartOver}
        />
      </div>
    </div>
  );
};
