'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { ChatIconButton } from '@/components/chat/ChatIconButton';

interface ChatTeaserProps {
  onOpen: () => void;
  onDismiss: () => void;
}

export const ChatTeaser: React.FC<ChatTeaserProps> = ({ onOpen, onDismiss }) => {
  const t = useTranslations('Chat');
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
      className="fixed bottom-20 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-1 rounded-2xl bg-white py-1 pl-4 pr-1 text-black shadow-chat print:hidden [html[data-menu-open]_&]:hidden"
    >
      <button
        type="button"
        onClick={onOpen}
        className="min-h-11 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        {t('teaser')}
      </button>
      <ChatIconButton icon="icon-cross" label={t('teaserDismissLabel')} onClick={onDismiss} />
    </motion.div>
  );
};
