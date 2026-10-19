/* Put on every animated marquee track inside a MarqueeRegion: pauses on the
   toggle, on hover and on focus-within. Full literals so Tailwind sees them. */
export const marqueePausedClass =
  'group-data-[paused=true]/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]';
