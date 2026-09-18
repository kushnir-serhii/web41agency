# 06 — How it works: step numbers + a real CTA

**Priority:** 🟡 major.
**Depends on:** 02 (`Button` with `href`, `ctaLinks.ts`).

## Problem
- `src/content/howItWorksContent.ts`: the 4th item is `{ logoId: "", title: "Free Consultation" }`.
  It renders as a step heading, not a button, and it does nothing.
- Steps 1–3 have no numbers.

## Steps
1. Content: remove the fake 4th item. Add an optional section-level CTA instead:
   ```ts
   cta: { title: "Ready to start?", text: "Free Consultation", href: "#lets-talk" }
   ```
2. `HowItWorksItem.tsx`: add a `step` number prop. Show it as a large label in the card,
   e.g. `01` in the top-right corner (`text-black/40`, or use `muted_text` from task 03), and put
   `<ol>` semantics on the list (`HowItWorksList` → `<ol>`).
3. Render the CTA in the 4th grid cell as a card with the same size and `bg-accent`
   background. It holds the short heading plus a real `<Button href>` (black pill). It must look
   like an action, not a 4th step. Keep the 2×2 grid on desktop.
4. Clean up while you are in there: the stray `{" "}` after `<Icon>` and the commented-out copy
   in `howItWorksItem.tsx`.

## Acceptance
- [x] Steps are numbered 01–03 and use `<ol>` markup
- [x] The CTA card is clearly a button, and it scrolls to the form
- [x] The layout still makes a clean 2×2 grid at `lg`, and one column on mobile
