const DOTS = [0, 1, 2];

export const ChatTyping: React.FC = () => (
  <div
    className="flex w-fit items-center gap-1 rounded-2xl bg-bg_item px-4 py-3.5"
    aria-hidden="true"
  >
    {DOTS.map((i) => (
      <span
        key={i}
        className="size-2 rounded-full bg-muted_text motion-safe:animate-pulse"
        style={{ animationDelay: `${i * 150}ms` }}
      />
    ))}
  </div>
);
