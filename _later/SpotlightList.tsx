'use client';

import type { ComponentPropsWithoutRef, PointerEvent } from 'react';

/* Moves the lime glow of the hovered `.spotlight` card to the pointer by setting
   --spot-x / --spot-y on it. One handler for the whole list; the glow itself is
   pure CSS (see `.spotlight` in globals.css) and only shows for a mouse. */
const trackSpotlight = (e: PointerEvent<HTMLUListElement>) => {
  if (e.pointerType !== 'mouse') return;
  const card = (e.target as HTMLElement).closest<HTMLElement>('.spotlight');
  if (!card || !e.currentTarget.contains(card)) return;

  const rect = card.getBoundingClientRect();
  card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
  card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
};

export const SpotlightList = (props: ComponentPropsWithoutRef<'ul'>) => (
  <ul {...props} onPointerMove={trackSpotlight} />
);
