# 03 — Hero heading contrast + lime circle overlap

**Priority:** 🔴 critical. The heading is the first thing a visitor sees.

## Problem
In `src/components/pageHero/PageHero.tsx`, the muted heading words use
`text-[#656973]/12`. That is about 1.1:1 contrast, so roughly 70% of the H1 is invisible
("Custom" / "Built to Perform" on Home, and "Our Work:" / "that Drive Results" on Portfolio).
The lime circle (`<Circle>`, top-left) also sits behind the letters. The muted grey on lime
is unreadable.

## Steps
1. Add a color token in `globals.css` `@theme inline`:
   `--color-muted_text: #656973;`
   Measured contrast: **5.5:1 on white**, **4.8:1 on lime `#DBFF04`**. Both pass AA.
2. In `PageHero`, change the muted span class to `text-muted_text`. Accent words stay
   `text-black`. The hierarchy comes from black vs. grey, not from transparency.
3. Circle placement: move the circles so they sit behind empty space, not the first
   word. Pick one:
   - desktop: shift it right/down, e.g. place it behind the description column, or keep
     `left={176}` and reduce the size to about 220 so it clears the cap height; or
   - drop the circle's `startY` offset so it does not drift over the text while it animates.
   Check both the mobile (`lg:hidden`) and desktop circles. Check the start and end of the scroll
   animation (`useScroll` moves it from `startY=150` to 0).
4. Do not change the heading copy.

## Acceptance
- [ ] Every H1 word is ≥4.5:1 against whatever is behind it, at 375 px and 1440 px, at
      scroll 0 and after scrolling. Check with DevTools contrast picker
- [ ] Home, Portfolio, Services, Contacts and About heroes all look right. PageHero is shared
- [x] No inline hex values left in PageHero
