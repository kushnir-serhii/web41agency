# 09 — Accessibility fixes (form, icons, focus, touch targets)

**Priority:** 🟡 major (WCAG 2.1 AA).
**Depends on:** 02 (Button), 08 (footer/LetsTalk edits). Run it last to avoid conflicts.

Already OK: all 43 images have alt text, `lang` is set, and the H1→H2→H3 order is correct.

## Issues and fixes

### 1. Form has no labels + low-contrast placeholder
`src/components/letsTalk/LetsTalk.tsx`
- Add a `<label>` to every field, tied to it with `htmlFor`/`id` ("Name", "Email", "Message").
  A visible label above each field is preferred (`text-base font-medium`). If the design must
  stay placeholder-only, use `sr-only` labels, but visible is better.
- Placeholder `#868686` gives 3.64:1. Change it to `#6b6b6b` or darker (≥4.5:1 on white).
- Add `autoComplete="name"` / `"email"`. Mark required fields with a visible `*` or
  "(required)".
- The focus ring `focus:ring-black/10` is almost invisible. Use `focus-visible:ring-2 ring-black`.

### 2. Icons: bad names and icon-only links
`src/components/ui/Icon.tsx` sets `aria-label={id}` on every SVG, so screen readers
read "icon-arrow", "icon-add" and so on.
- Default to `aria-hidden="true"` and `focusable="false"`. Add an optional `title`/`label` prop
  that sets `role="img"` + `aria-label` when you pass one.
- `SocialList.tsx`: the Instagram, Dribbble and Email links have no accessible name. Add
  `aria-label="Instagram"`, `"Dribbble"` and `"Email us"`. Remove `target="_blank"` from the
  mailto link.
- Check the other icon-only controls: the hamburger (has a label ✓), the portfolio arrows
  (have labels ✓) and the LetsTalk send link (has a label ✓).

### 3. Touch targets < 44 px
- Portfolio carousel arrows (`src/components/portfolio/Portfolio.tsx`) are 40×40. Make them
  `size-11` (44 px) and center the icon.
- Footer social links are 34×34. Give the `<Link>` `size-11 flex items-center justify-center`,
  and keep the icon at 34.
- Mobile menu close button (`Header.tsx`, `w-10 h-10`) → `size-11`.

### 4. No `:focus-visible` styles
- Add a global base rule in `globals.css`:
  ```css
  :where(a, button, input, textarea, select, [tabindex]):focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
  ```
  On dark backgrounds (footer), use a white outline:
  `footer :focus-visible { outline-color: #fff; }`.
- `Button.tsx` currently has both `focus:` and `focus-visible:` outline classes. Keep only
  `focus-visible:`, so mouse clicks don't leave a ring.
- Nav links (`NavBarItem.tsx`) and accordion buttons must show the ring.

### 5. Reduced motion
The circle parallax and marquee sliders should respect `prefers-reduced-motion`. In
`Circle.tsx`, use `useReducedMotion()` from `motion/react` and skip the transform.

## Acceptance
- [ ] axe DevTools / Lighthouse a11y on `/` and `/portfolio`: no violations, score ≥ 95
- [ ] Tab through the whole page: every interactive element shows a visible ring
- [ ] Screen reader: form fields read their labels, social links read their names, and
      decorative icons are silent
- [ ] Every tap target is ≥ 44×44 at 375 px
