# 003 — Privacy Policy & Terms of Use redesign

**Priority:** 🟡 medium. Both pages exist (spec 001/08) but are plain text walls with duplicated JSX.
**Goal:** make them look like the rest of the site and easy to scan. The look is bold Fixel Display
type, black/white with the `accent` (#DBFF04) highlight, `bg_item` cards and pill shapes.

## Design direction (product design rationale)

Legal pages are *reference* documents, so people scan them rather than read top to bottom.
The modern pattern (Stripe, Linear, Vercel) is:

1. **Plain-language summary first.** Show an "At a glance" card before the legal text.
2. **Persistent navigation.** Keep a sticky table of contents with scroll-spy on desktop and a
   collapsible "On this page" on mobile.
3. **Deep-linkable sections.** Give every section a stable id and a hover `#` anchor. Numbered
   headings (`01`, `02`…) help people say "see section 4".
4. **Clear metadata.** Show "Last updated" in a `<time>` element, plus the reading time.
5. **Obvious next step.** End with a contact card (email) and a link to the other legal doc.
6. **Readable measure.** Keep body text around 65–75ch at `text-lg` with relaxed leading, and
   use muted secondary text (`text-black/60`).

## Layout

```
Desktop (lg+)
┌──────────────────────────────────────────────────────────────┐
│ Legal / Privacy Policy                     (breadcrumb, /60) │
│ Privacy Policy                        (h1 44/72px bold)      │
│ description (text-lg /80)                                    │
│ [● Updated Sep 18, 2026] [5 min read]      (pill chips)      │
│ ( Privacy Policy | Terms of Use )          (pill switcher)   │
├──────────────┬───────────────────────────────────────────────┤
│ ON THIS PAGE │ ┌ At a glance (bg_item, rounded-lg) ────────┐ │
│ 01 What we…  │ │ ✓ point   ✓ point                         │ │
│▌02 Cookies ← │ │ ✓ point   ✓ point      (2-col grid)       │ │
│ 03 …         │ └───────────────────────────────────────────┘ │
│ (sticky,     │ intro paragraph                               │
│  top-28)     │ 01  What we collect   #                       │
│              │ body… list with accent markers                │
│              │ ─────────────                                 │
│              │ 02  …                                         │
│              │ ┌ Contact card (bg black, white text) ──────┐ │
│              │ │ Questions? email  [Email us] (accent btn) │ │
│              │ └───────────────────────────────────────────┘ │
│              │ Also read: Terms of Use →                     │
└──────────────┴───────────────────────────────────────────────┘
<LetsTalk />  (keep it: the header "Free Quote" CTA points to #lets-talk)

Mobile: same order in one column. The TOC becomes a <details> "On this page" card
under the switcher. There is no sticky sidebar.
```

## Implementation steps

### 1. Content model — `src/content/legal/types.ts`
- Add `summary: string[]` to `LegalDocument` for the "At a glance" points, 4 short plain-language sentences.
- Add an optional `id?: string` to `LegalSection`. If it is missing, derive the id by slugifying the heading.
- Change `lastUpdated` to ISO (`'2026-09-18'`) and format it for display with
  `Intl.DateTimeFormat('en-US', { dateStyle: 'long' })`.
- Add `slug: 'privacy-policy' | 'terms-of-use'` so the switcher and cross-links are driven by data.

### 2. Content — `privacy.ts`, `terms.ts`
- Add `summary`, `slug` and an ISO `lastUpdated` to both. Keep all existing sections and TODO comments.
- Privacy: add two short generic sections, **"How we protect your data"** (HTTPS, access limited to
  the team, reputable providers) and **"Children"** (the Site is not aimed at under-16s).
  Put them before "Contact". Do not invent facts: no analytics or cookies (the repo has none).
- Write the summary points in plain words, for example Privacy: "We only collect what you send us
  through the form or email.", "No tracking or advertising cookies.", "We never sell your data.",
  "Ask us anytime to see or delete your data."
- Put a legal-docs registry in `src/content/legal/index.ts`: `export const legalDocuments = [privacyPolicy, termsOfUse]`.

### 3. Shared components — `src/components/legal/`
- `LegalPage.tsx` (server): takes a `LegalDocument` and renders the whole layout above. Both route
  pages become roughly 15 lines each: metadata plus `<LegalPage doc={…} />`.
- `LegalHero.tsx`: breadcrumb, h1, description, meta chips (updated date as `<time dateTime>`, and
  reading time computed from word count at 200 wpm), and the doc switcher. The switcher is a pill
  group using `next/link`, with `aria-current="page"` on the active pill. Active pill style: `bg-black text-white`; inactive:
  `border border-black/10`.
- `LegalSummary.tsx`: an "At a glance" card with `bg-bg_item rounded-lg p-6 lg:p-10`, a 2-col grid on md+,
  and each point preceded by a small accent circle holding a check icon (inline SVG, `aria-hidden`).
- `LegalSection.tsx`: `<section id aria-labelledby>`, with the number `01` in `text-black/40 tabular-nums`,
  the h2 `text-2xl lg:text-3xl font-bold`, and an anchor `<a href="#id">` "#" that shows on hover/focus
  (`opacity-0 group-hover:opacity-100 focus-visible:opacity-100`, `aria-label="Link to <heading>"`).
  Use `scroll-mt-32` so the sticky header does not cover the heading. Lists get custom markers
  (a small accent/black dot) instead of `list-disc`. Put a divider `border-t border-black/10` between sections.
- `LegalToc.tsx` (`'use client'`): the desktop sticky `nav aria-label="Table of contents"`. Its scroll-spy
  uses `IntersectionObserver` (`rootMargin: '-20% 0px -70% 0px'`). The active item gets `text-black font-bold`
  and a 2px accent/black left bar with `aria-current="true"`; the rest are `text-black/60 hover:text-black`.
  Mobile variant: a `<details>` card (`bg-bg_item rounded-lg`) with the same list. Close it when a link is clicked.
- `LegalContactCard.tsx`: a black rounded-lg card with white text: "Questions about this policy?" plus a
  line of copy, a `mailto:${CONTACT_EMAIL}` link styled like an accent pill button (`bg-accent text-black`),
  and the email shown as text too. Below the card add "Also read: <other doc> →" as a link.
- Reuse existing patterns: `cn` from `@/utils/cn`, `container` class, `max-w-[1440px] px-4 lg:px-20`,
  the top padding used by `CaseHero` (`pt-[140px] lg:pt-[120px]`), and the `Button` component where a link-button fits.

### 4. Routes
- Rewrite `src/app/(root)/privacy-policy/page.tsx` and `terms-of-use/page.tsx` to use `LegalPage`.
  Keep the existing metadata (title, description, canonical, robots). Add `openGraph: { title, description, url }`.
- Add JSON-LD: a `WebPage` with `name`, `url`, `dateModified` (ISO) and a `BreadcrumbList`
  (Home → Legal doc), inline `<script type="application/ld+json">` as in `layout.tsx`.

### 5. Print & a11y polish
- Add `print:hidden` to the TOC, switcher, contact button and LetsTalk. In print, the article goes full width.
- Use a single `h1` and sequential `h2`s. Keep focus-visible rings (global styles already exist).
  All interactive targets must be at least 44px (`min-h-11`).
- Motion: none needed. If you add any, respect `prefers-reduced-motion`.

## Acceptance
- [ ] Both pages render the new layout and share one `LegalPage` component, with no duplicated JSX
- [ ] The TOC highlights the current section while scrolling, and anchors land below the sticky header
- [ ] Mobile (375px): no horizontal scroll, the TOC is collapsible, and the switcher fits
- [ ] "Last updated" is a `<time dateTime="YYYY-MM-DD">`, and reading time shows
- [ ] No hardcoded email or domain. Everything comes from `site.ts`
- [ ] `npm run lint` and `npm run tsc` pass, and `npm run build` succeeds
