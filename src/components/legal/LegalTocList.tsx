import { cn } from '@/utils/cn';

export interface LegalTocListItem {
  id: string;
  label: string;
  number: string;
}

interface LegalTocListProps {
  items: LegalTocListItem[];
  activeId: string;
  onNavigate?: () => void;
}

export const LegalTocList: React.FC<LegalTocListProps> = ({ items, activeId, onNavigate }) => (
  <ul className="flex flex-col gap-1">
    {items.map(({ id, label, number }) => {
      const isActive = id === activeId;
      return (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={onNavigate}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'flex min-h-11 items-center gap-2 border-l-2 py-2 pl-3 text-sm leading-snug transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
              isActive ? 'border-black font-bold text-black' : 'border-transparent text-black/60',
            )}
          >
            <span>{number}</span>
            <span>{label}</span>
          </a>
        </li>
      );
    })}
  </ul>
);
