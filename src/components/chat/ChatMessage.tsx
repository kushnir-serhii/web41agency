import ChatMarkdown from '@/components/chat/ChatMarkdown';

export type ChatMessageVariant = 'bot' | 'user' | 'error';

interface ChatMessageProps {
  variant: ChatMessageVariant;
  content?: string;
  children?: React.ReactNode;
}

const ROW: Record<ChatMessageVariant, string> = {
  bot: 'justify-start',
  error: 'justify-start',
  user: 'justify-end',
};

const BUBBLE: Record<ChatMessageVariant, string> = {
  bot: 'bg-bg_item text-black',
  error: 'border border-red-600 bg-white text-black',
  user: 'bg-black text-white whitespace-pre-wrap',
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ variant, content = '', children }) => (
  <div className={`flex ${ROW[variant]}`}>
    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm break-words ${BUBBLE[variant]}`}>
      {children ?? (variant === 'user' ? content : <ChatMarkdown content={content} />)}
    </div>
  </div>
);
