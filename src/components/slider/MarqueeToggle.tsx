'use client';

interface MarqueeToggleProps {
  isPaused: boolean;
  onToggle: () => void;
  pauseLabel: string;
  playLabel: string;
  className?: string;
}

/* 44px white/75 circle (same family as the portfolio arrows) that stops and
   restarts a marquee (WCAG 2.2.2). Hidden when reduced motion already stops it. */
export const MarqueeToggle: React.FC<MarqueeToggleProps> = ({
  isPaused,
  onToggle,
  pauseLabel,
  playLabel,
  className,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isPaused ? playLabel : pauseLabel}
    aria-pressed={isPaused}
    className={`motion-reduce:hidden flex items-center justify-center size-11 rounded-full bg-white/75 text-black backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${className ?? ''}`}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      {isPaused ? (
        <path d="M4 2.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5Z" />
      ) : (
        <>
          <rect x="3" y="2" width="3.5" height="12" rx="1" />
          <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
        </>
      )}
    </svg>
  </button>
);
