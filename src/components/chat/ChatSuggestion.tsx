interface ChatSuggestionProps {
  text: string;
  onSelect: (text: string) => void;
}

export const ChatSuggestion: React.FC<ChatSuggestionProps> = ({ text, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(text)}
    className="min-h-11 rounded-full border border-black px-4 py-2 text-left text-base transition-colors motion-reduce:transition-none hover:bg-bg_item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
  >
    {text}
  </button>
);
