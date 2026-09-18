# 05 — Services: visible on mobile + clear affordance

**Priority:** 🟡 major. On mobile the section shows only 5 bare words.
**Depends on:** 04 (price data).

## Problem
`src/components/services/servicesComponents/ServiceItem.tsx`:
- On mobile the description block is `hidden` unless the item is open, and nothing shows
  that the item can be tapped.
- On desktop the description appears only on hover (`lg:opacity-0 lg:group-hover:opacity-80`).
  Keyboard and touch-laptop users never see it.
- No icon and no dividers, so the rows don't look interactive. The FAQ
  (`src/components/faq/faqComponents/FaqItem.tsx`) has a "+" that rotates, and that works.

## Target pattern
Use the same accordion as the FAQ:
- Row: title (left) + price chip (right, always visible) + `icon-add` (rotates 45° when open).
- `border-b border-black/10` between rows (and `border-t` on the first).
- The body opens with the same `grid-rows-[0fr]→[1fr]` transition as FaqItem. Hover must not
  reveal the body.
- Body: description + `timeline` + a small "Get a quote" link to `#lets-talk` (from task 02
  `ctaLinks.ts`; if 02 is not merged yet, hardcode `#lets-talk` and leave a TODO).
- Mobile: the **first item starts open**, and the title and price are always visible. Do not
  use `hidden`.
- Keep the lime circle hover accent on desktop. It is decoration only.

## Steps
1. Build the shared markup from FaqItem. Reuse it only if the result stays simple:
   copying the grid-rows trick is fine.
2. `aria-expanded` on the button and `aria-controls` → the body's `id`.
3. `Services.tsx`: initial state `openTitle = services[0].title`.

## Acceptance
- [ ] At 375 px: each row shows the title and price, and a "+" makes it clear the row opens
- [ ] At 1440 px: a click opens and closes the row. Hover alone does not reveal content
- [x] Keyboard toggle works, and screen readers announce expanded/collapsed
- [ ] The same look as the FAQ accordion
