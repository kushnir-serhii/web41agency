# 02 — Make every CTA work

**Priority:** 🔴 critical. This is the top priority, because right now the site cannot convert.
**Depends on:** 01.

## Problem
Every CTA is a `<button type="button">` with no `href` and no handler:
- Header "Free Quote": desktop in `src/components/layout/navBar/NavBar.tsx`, mobile in
  `src/components/layout/Header.tsx`
- Hero "Free Consultation" + "View Projects": `src/components/pageHero/PageHero.tsx`
  (used on every page)
- Why Choose Us "Free Consultation": `src/components/whyChoose/WhyChoose.tsx`
- How it works, 4th cell "Free Consultation": handled in task 06. This task only
  provides the link target.

`Button.tsx` also sets `aria-label={text + "button"}`, which gives labels like
"Free Consultationbutton".

## Steps
1. **LetsTalk anchor:** add `id="lets-talk"` and `scroll-mt-24` (so the fixed header does
   not cover it) to the `<section>` in `LetsTalk.tsx`. Add
   `html { scroll-behavior: smooth; }` inside `@media (prefers-reduced-motion: no-preference)`
   in `globals.css`.
2. **Button → link support:** give `Button` an optional `href` prop. When it is set, render
   `next/link` `<Link>` with the same classes. Otherwise render `<button>`. Also
   accept `type` (`"button" | "submit"`, default `"button"`). The LetsTalk
   "Send Message" button must be `type="submit"`: it is `type="button"` now, so
   the form never submits. Remove the custom `aria-label`, because the visible text is the label.
3. **CTA targets** (put them in a small constant, e.g. `src/content/ctaLinks.ts`):
   - `CONSULTATION_HREF = "#lets-talk"`
   - `PROJECTS_HREF = "/portfolio"`
4. Wire them up:
   - Header Free Quote (desktop + mobile): `#lets-talk`. On mobile, also close the menu.
     Because the header is on every page and every page has LetsTalk, a bare hash works.
   - PageHero: add props `primaryHref` (default `#lets-talk`) and `secondaryHref`
     (default `/portfolio`). On `/portfolio`, hide the "View Projects" button, since it
     points to the page you are on: pass `secondaryButton={null}` or add a `hideSecondary` prop.
   - WhyChoose: `href="#lets-talk"`. Add `href` to `IWhyChooseContent` / `whyChooseContent`.
5. Header CTAs are currently raw `<button>`s. Switch them to `<Link>` and keep the current look.

## Acceptance
- [x] Clicking each CTA on `/`, `/portfolio`, `/services`, `/about-us`, `/contacts` scrolls
      to the form or navigates. No CTA does nothing
- [x] The mobile menu closes after "Free Quote"
- [x] The form heading is not hidden under the header after the scroll
- [x] Keyboard: Tab reaches every CTA, and Enter activates it
- [x] No "View Projects" button on `/portfolio`
