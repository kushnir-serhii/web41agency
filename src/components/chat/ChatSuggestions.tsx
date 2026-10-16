import { useTranslations } from 'next-intl';

import { ChatSuggestion } from '@/components/chat/ChatSuggestion';

const SUGGESTION_KEYS = ['landingPrice', 'timeline', 'webflowVsCode'] as const;

interface ChatSuggestionsProps {
  onSelect: (text: string) => void;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ onSelect }) => {
  const t = useTranslations('Chat');
  return (
    <div className="flex flex-col items-start gap-2">
      {SUGGESTION_KEYS.map((key) => (
        <ChatSuggestion key={key} text={t(`suggestions.${key}`)} onSelect={onSelect} />
      ))}
    </div>
  );
};
