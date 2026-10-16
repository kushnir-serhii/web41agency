# Tasks: Privacy Policy & Terms of Use Redesign (003)

Spec: [functional-spec.md](functional-spec.md) · [technical-considerations.md](technical-considerations.md) · [decisions.md](decisions.md)

## Open Questions

- No QA-coded agent is installed (only `nextjs-frontend`, `nextjs-api-backend`, `vercel-infra` plus generic ones). The Feature Testing & Regression slice (Slice 8) runs under `general-purpose`. Run `/awos:hire` to install a testing agent (for example `testing-expert`) and re-run `/awos:tasks`, or accept the generalist.
- Playwright setup (config, devDependency, script) is assigned to `vercel-infra`, but the owner must approve the new `@playwright/test` devDependency (see tech spec §4).

---

- [x] **Slice 1: Global layout fixes (sticky + print) — separate commit**

  > Makes `position: sticky` work site-wide and hides the site header/footer in print. Affects every page, so it ships as its own commit.
  - [x] In `src/app/layout.tsx`, replace `overflow-x-hidden` on the root wrapper with `overflow-x-clip` (no `overflow-y-*` beside it). **reuse:** `src/app/layout.tsx`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] In `src/app/layout.tsx`, add `print:hidden` to the Header wrapper and the Footer. **reuse:** `src/app/layout.tsx`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Verify (smoke): run `npm run tsc` and `npm run lint`; start the app and check home, portfolio and a case page plus the mobile menu at 375px (`document.documentElement.scrollWidth === innerWidth`, header still sticks). Delete screenshots and stop any server started (by PID). **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 2: Redesigned legal page shell with header and numbered sections**

  > After this slice both routes render the new layout: hero (breadcrumb, title, description, date and reading-time chips) and numbered, linkable sections. Content model and helpers are in place.
  - [x] Add `src/utils/slugify.ts` (`slugify(text)`: lowercase, strip diacritics, non-alphanumerics → `-`, trim). **new:** `src/utils/slugify.ts`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Update the content types in `src/content/legal/` : add `LegalSlug`, `LegalDocument.slug`, `summary: string[]`, optional `LegalSectionData.id`; rename `LegalSection` type → `LegalSectionData`; `lastUpdated` becomes ISO `YYYY-MM-DD`. Update every importer of the old type. **extend:** existing legal content type file. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Edit `src/content/legal/privacy.ts`: add `slug`, `summary` (4 points from functional spec §2.2), ISO `lastUpdated` (actual ship date), and the two new sections "How we protect your data" and "Children" (under 16) directly before "Contact". Keep all existing sections, wording and `TODO` comments unchanged. **extend:** `src/content/legal/privacy.ts`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Edit `src/content/legal/terms.ts`: add `slug`, `summary` (4 points from functional spec §2.2) and ISO `lastUpdated`. **extend:** `src/content/legal/terms.ts`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Add `src/content/legal/index.ts` with the `legalDocuments` registry and `getOtherLegalDocs(slug)`. **new:** `src/content/legal/index.ts`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Add `src/content/legal/utils.ts`: `getSectionId`, `getTocItems` (always throws on duplicate id), `getReadingMinutes` (`max(1, ceil(words/200))`), `formatLegalDate` (`Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })`, `timeZone: 'UTC'` mandatory). **new:** `src/content/legal/utils.ts`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Create `LegalHero` (breadcrumb with plain-text "Legal", h1, description, `meta` chips via `.map()`; top padding like `CaseHero`; no switcher yet). **new:** `src/components/legal/LegalHero.tsx`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Create `LegalSection` (`<section id aria-labelledby class="scroll-mt-32">`, grey two-digit number with `tabular-nums`, h2, `#` anchor with `aria-label="Link to <heading>"` — `opacity-40` below `lg`, hover/focus-visible only from `lg` — `paragraphs.map()`, `list.map()` with custom dot markers, `border-t` divider). **new:** `src/components/legal/LegalSection.tsx`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Create `LegalPage` server component (hero full width in `.container`; grid `lg:grid-cols-[240px_minmax(0,1fr)] gap-16` with empty aside slot; `<article class="max-w-[72ch] break-words print:max-w-none">` with intro + `doc.sections.map()`; `<div class="print:hidden"><LetsTalk /></div>` after the container). **new:** `src/components/legal/LegalPage.tsx`; **reuse:** `src/components/letsTalk/LetsTalk.tsx` (unchanged). **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Reduce `src/app/(root)/privacy-policy/page.tsx` and `src/app/(root)/terms-of-use/page.tsx` to thin routes rendering `<LegalPage doc={…} />`; remove the old rendering components if now unused. Keep existing `metadata` for now. **extend:** both route files. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Verify (smoke): `npm run tsc`, `npm run lint`, `npm run build` (both routes `○ (Static)`); open `/privacy-policy` and `/terms-of-use` at desktop and 375px — hero, numbered sections, `#` links, no sideways scroll; footer links still work; opening `/privacy-policy#cookies-and-analytics` shows the heading below the header. Delete screenshots; stop servers by PID. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 3: Switcher and "At a glance" summary**

  > Visitors can switch between Privacy Policy and Terms of Use, and see the 4-point summary above the intro.
  - [x] Add a `check` symbol to `public/icons/sprite.svg`, following existing viewBox conventions. **extend:** `public/icons/sprite.svg` (rendered via `src/components/ui/Icon.tsx`, no prop change). **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Create `LegalSwitcher` (`legalDocuments.map()` → `next/link` pills, `aria-current="page"`, active `bg-black text-white`, inactive `border-black/10`, `min-h-11`, fits one line at 375px) and place it in `LegalHero`. **new:** `src/components/legal/LegalSwitcher.tsx`; **extend:** `src/components/legal/LegalHero.tsx`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Create `LegalSummary` ("At a glance" card: `doc.summary.map()` → `<li>` with accent check circle via `Icon`; `bg-bg_item rounded-lg`; 2 columns from `md`) and render it above the intro in `LegalPage`. **new:** `src/components/legal/LegalSummary.tsx`; **extend:** `src/components/legal/LegalPage.tsx`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Verify (smoke): `npm run tsc`, `npm run lint`; check the switcher navigates both ways with correct selected state, and the summary shows 4 points (2 columns at 768px, 1 at 375px). Delete screenshots; stop servers by PID. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 4: Table of contents with scroll-spy**

  > Desktop sticky "On this page" list with active-section highlight; collapsed mobile card above the summary.
  - [x] Create `useActiveSection(ids) → activeId` (IntersectionObserver with pixel `rootMargin` ≈ `-120px 0px -65% 0px`; ref set of intersecting ids; first in TOC order wins; keep previous when empty; initial = `location.hash` match or first id; passive scroll listener forces last id at page bottom, cleaned up on unmount). **new:** `src/components/legal/useActiveSection.ts`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Create `LegalTocList` (`items.map()` of `{ id, label, number }`; active: `font-bold text-black`, 2px left bar, `aria-current="true"`; others `text-black/60`). **new:** `src/components/legal/LegalTocList.tsx`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Create `LegalToc` client component with `variant: 'desktop' | 'mobile'` (desktop: `nav` `sticky top-28 self-start`, distinct `aria-label`; mobile: uncontrolled `<details>` card with `lg:hidden` and custom chevron, link `onClick` sets `ref.current.open = false` without `preventDefault`). Receives only serializable `items`. **new:** `src/components/legal/LegalToc.tsx`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Wire both variants into `LegalPage`: desktop in `<aside class="hidden lg:block print:hidden">`, mobile first inside the article; items from `getTocItems(doc)`. **extend:** `src/components/legal/LegalPage.tsx`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Verify (smoke): `npm run tsc`, `npm run lint`; at 1280px the TOC stays pinned and highlights follow scroll (first on load, last at bottom); at 375px the card starts collapsed and closes after a tap. Delete screenshots; stop servers by PID. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 5: Contact card, "Also read" link and accent Button**

  > Black contact card with lime "Email us" button and a cross-link to the other legal document.
  - [x] Extend `Button`: add `btnType: 'accent'` (`bg-accent text-black`) and render a plain `<a>` when `href` starts with `mailto:`, `tel:` or `http`; internal hrefs keep `next/link`. **extend:** `src/components/ui/Button.tsx`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Create `LegalContactCard` (black card; heading "Questions about this policy?" / "Questions about these terms?"; one line of copy; accent "Email us" `mailto:${CONTACT_EMAIL}` button; email as text with `break-all`; "Also read: <doc> →" via `getOtherLegalDocs(slug).map()` → `next/link`; `focus-visible:outline-white` on links inside the card) and render it at the end of the article. Use `CONTACT_EMAIL` from `src/utils/site.ts`, no hard-coded email. **new:** `src/components/legal/LegalContactCard.tsx`; **extend:** `src/components/legal/LegalPage.tsx`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Verify (smoke): `npm run tsc`, `npm run lint`; check other pages using `Button` look unchanged; contact card text, `mailto:` link, "Also read" navigation and visible focus ring on the black card; "Free Quote" still scrolls to `#lets-talk`. Delete screenshots; stop servers by PID. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 6: SEO — metadata, Open Graph image, JSON-LD, sitemap**

  > Shared link previews and structured data for both legal pages.
  - [x] Add `DEFAULT_OG_IMAGE` to `src/utils/site.ts` and use it in `src/app/layout.tsx`. **extend:** `src/utils/site.ts`, `src/app/layout.tsx`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Create `buildLegalMetadata(doc)` (keep title, description, canonical `/${slug}`, robots; add `openGraph` with `type`, `siteName`, `url`, `title`, `description`, `images: [DEFAULT_OG_IMAGE]`) and `buildLegalJsonLd(doc)` (`@graph` with `WebPage` `${url}#webpage` incl. `dateModified`, `isPartOf`, `inLanguage: 'en'`, and a Home → document `BreadcrumbList`). Use `SITE_URL`, `SITE_NAME`; no hard-coded domain. **new:** `src/content/legal/metadata.ts`. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Use `buildLegalMetadata` in both route files and render one `<script type="application/ld+json">` (escape `<` as `<`) in `LegalPage`. **extend:** both route files, `src/components/legal/LegalPage.tsx`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] In `src/app/sitemap.ts`, set `lastModified: doc.lastUpdated` for the two legal URLs. **extend:** `src/app/sitemap.ts`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Add `src/components/legal/index.ts` barrel and regenerate `context/components-index.md`. **new:** `src/components/legal/index.ts`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Verify (smoke): `npm run tsc`, `npm run lint`, `npm run build` (routes stay `○ (Static)`); check `og:title`, `og:description`, `og:image` in each page head and that the JSON-LD parses. Stop servers by PID. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 7: Playwright tooling**

  > Test infrastructure only, so Slice 8 can run. Requires owner approval of the `@playwright/test` devDependency.
  - [x] Add `@playwright/test` devDependency, root `playwright.config.ts` (`webServer`: `next build && next start` on a spare port), and an `npm run test:e2e` script. Keep separate from `tools/mockup`. **new:** `playwright.config.ts`. **[Agent: vercel-infra]** **[Model: sonnet]**
  - [x] Verify (smoke): `npm run lint` and `npm run tsc` still pass and `npx playwright test --list` runs without config errors. **[Agent: vercel-infra]** **[Model: sonnet]**

- [x] **Slice 8: Feature Testing & Regression**

  > Verifies the whole feature end-to-end against functional-spec.md, run after all implementation slices are complete.
  - [x] Read functional-spec.md acceptance criteria in full. Generate acceptance-level tests that verify the entire feature as a whole — not individual slices. Cover applicable layers (unit for pure logic, integration for service interactions, e2e for user flows) based on the project's testing stack. Write tests with RED validation (must fail before implementation is confirmed done). Annotate each test with `@spec: 003-legal-pages-redesign` and `@regression` if suitable for long-term regression. Put everything in one file, `tests/e2e/legal-pages.spec.ts`, using grouped `describe` blocks (helpers, header and switcher, summary, sections and anchors, TOC, contact card, mobile/keyboard/print, SEO) as listed in tech spec §4. **[Agent: general-purpose]** **[Model: sonnet]**
  - [x] Run all generated tests. All must pass. Fix any failures before proceeding. **[Agent: general-purpose]** **[Model: sonnet]**
