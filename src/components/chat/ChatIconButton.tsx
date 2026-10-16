import { Icon } from '@/components/ui/Icon';

interface ChatIconButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ChatIconButton: React.FC<ChatIconButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
  >
    <Icon id={icon} width={20} height={20} />
  </button>
);
