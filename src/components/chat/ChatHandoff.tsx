'use client';

import { useTranslations } from 'next-intl';

import { useHandoffNavigate } from '@/components/chat/useHandoffNavigate';
import { Button } from '@/components/ui/Button';
import { CONSULTATION_HREF } from '@/content/ctaLinks';

interface ChatHandoffProps {
  onNavigate: () => void;
}

export const ChatHandoff: React.FC<ChatHandoffProps> = ({ onNavigate }) => {
  const t = useTranslations('Chat');
  const handleClick = useHandoffNavigate(onNavigate, 'handoff_card');

  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl bg-black px-4 py-3 text-white">
      <p className="text-sm">{t('handoffLine')}</p>
      <Button
        text={t('handoffCta')}
        btnType="accent"
        size="sm"
        href={`/${CONSULTATION_HREF}`}
        onClick={handleClick}
        className="focus-visible:outline-white"
      />
    </div>
  );
};
