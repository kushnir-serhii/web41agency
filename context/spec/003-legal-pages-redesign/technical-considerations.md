# Technical Specification: Privacy Policy & Terms of Use Redesign

- **Functional Specification:** [functional-spec.md](functional-spec.md) (design direction in [README.md](README.md), decisions in [decisions.md](decisions.md))
- **Status:** Completed
- **Author(s):** Serhii Kushnir (with Claude)

---

## 1. High-Level Technical Approach

Both legal pages become thin static route files that render one shared server component, `LegalPage`, from
the existing typed content modules in `src/content/legal/`. The content model gains a slug, an ISO date, an
"At a glance" summary and optional section ids. Pure helpers compute derived values: section ids, TOC items,
reading time and the formatted date. The scroll-spy table of contents is the only client code. Everything
else is server-rendered, and both routes stay `○ (Static)`.

Changes outside `legal/`:

- one global layout fix so that `position: sticky` works;
- an `accent` variant and external-link support on `Button`;
- a `check` symbol in the icon sprite;
- shared OG-image constants, so the per-page `openGraph` does not drop the image.

URLs stay `/privacy-policy` and `/terms-of-use`. `LetsTalk` stays at the bottom of both pages.

---

## 2. Proposed Solution & Implementation Plan (The "How")

### 2.1 Architecture changes

- **No new services, routes, API endpoints or dependencies** for the feature itself. The only possible new devDependency is for testing (see §4).
- **Global sticky fix** in `src/app/layout.tsx`: the root wrapper uses `overflow-x-hidden`. That makes `overflow-y` compute to `auto`, so the wrapper becomes a scroll container that never scrolls, and sticky children (the header and the new TOC) never pin to the viewport. Replace it with `overflow-x-clip`, which hides horizontal overflow without creating a scroll container. Do not add any `overflow-y-*` next to it. Ship this as its own commit, because it affects every page.
- **Print:** add `print:hidden` to the site Header wrapper and the Footer in `layout.tsx`. Without this, the sticky header and the footer also print, and AC 2.7 fails.

### 2.2 Data model: `src/content/legal/`

No database. These are typed TypeScript content modules.

| Type / field | Change | Purpose |
|---|---|---|
| `LegalSlug` | **new**: `'privacy-policy' \| 'terms-of-use'` | Route segment; drives the switcher and cross-links |
| `LegalDocument.slug` | **new**, required | as above |
| `LegalDocument.lastUpdated` | display string → **ISO `YYYY-MM-DD`** | `<time dateTime>`, JSON-LD `dateModified`, sitemap `lastModified` |
| `LegalDocument.summary` | **new** `string[]` (exactly 4) | "At a glance" points (wording in functional spec §2.2) |
| `LegalSectionData.id` | **new**, optional | Overrides the slugified heading id |
| `LegalSection` (type) | **renamed → `LegalSectionData`** | Avoids a name clash with the `LegalSection` component |

Content edits:

- `privacy.ts`:
  - add `slug`, `summary` and an ISO `lastUpdated`;
  - add two sections, **"How we protect your data"** and **"Children"** (under 16), directly before "Contact";
  - keep all existing sections, their wording and the `TODO` comments unchanged;
  - keep the "No tracking or advertising cookies" summary point, which matches the existing "Cookies and analytics" section.
- `terms.ts`: add `slug`, `summary` and an ISO `lastUpdated`.
- **new** `index.ts`: the `legalDocuments` registry (`[privacyPolicy, termsOfUse]`) and `getOtherLegalDocs(slug)`.

Pure helpers:

| File | Helper | Contract |
|---|---|---|
| `src/utils/slugify.ts` (new) | `slugify(text)` | Lowercase, strip diacritics, replace non-alphanumerics with `-`, then trim. Reusable site-wide. |
| `src/content/legal/utils.ts` (new) | `getSectionId(section)` | Returns `id ?? slugify(heading)`. |
| | `getTocItems(doc)` | Returns `{ id, label, number }[]`, where `number` is `01`, `02`, …. **Always throws** on a duplicate id, so the static build fails instead of shipping broken anchors. |
| | `getReadingMinutes(doc)` | Counts words in summary, intro and sections; returns `max(1, ceil(words / 200))`. |
| | `formatLegalDate(iso)` | `Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })` applied to `iso` read as UTC midnight. **`timeZone: 'UTC'` is mandatory.** Without it, a build west of UTC shows "September 17". |
| `src/content/legal/metadata.ts` (new) | `buildLegalMetadata(doc)` | Returns `Metadata` (see §2.3). |
| | `buildLegalJsonLd(doc)` | Returns an `@graph` with a `WebPage` and a `BreadcrumbList`. |

Section ids must not collide with page-level ids. The only one today is `lets-talk`, and no heading collides with it.

### 2.3 Routes, metadata and SEO

| Route file | Change |
|---|---|
| `src/app/(root)/privacy-policy/page.tsx` | About 10 lines: `metadata = buildLegalMetadata(privacyPolicy)`, render `<LegalPage doc={privacyPolicy} />` |
| `src/app/(root)/terms-of-use/page.tsx` | Same, with `termsOfUse` |

- Keep two static route files. Do not add a dynamic `[slug]` route.
- **Metadata:** `title`, `description`, canonical `/${slug}` and `robots` stay as they are today. Add `openGraph` with `type`, `siteName`, `url`, `title`, `description` and `images`. Next.js merges metadata **shallowly**, so a page-level `openGraph` replaces the root one completely. To keep a single source for the image, add `DEFAULT_OG_IMAGE` to `src/utils/site.ts` and use it in both `layout.tsx` and the helper. The root `twitter` block stays inherited because the page does not set one.
- **JSON-LD:** one `<script type="application/ld+json">` rendered in `LegalPage`, containing:
  - a `WebPage` with `@id` `${url}#webpage`, `url`, `name`, `description`, `dateModified`, `isPartOf: SITE_URL` and `inLanguage: 'en'`;
  - a `BreadcrumbList` of Home → the document.

  Escape `<` as `<` in the serialized JSON.
- **Sitemap:** in `src/app/sitemap.ts`, the two legal URLs use `lastModified: doc.lastUpdated` instead of `new Date()`.
- **No hard-coded email or domain.** Everything comes from `CONTACT_EMAIL`, `SITE_URL` and `SITE_NAME` in `src/utils/site.ts`.

### 2.4 Component breakdown

Index checked: `context/components-index.md`, regenerated with 40 components.

| UI piece | Tag | Notes |
|---|---|---|
| Page shell | `new: legal/LegalPage.tsx` | Server component. Composes the grid, computes TOC items, minutes and the date once, and renders the JSON-LD. No legal page shell exists today. |
| Header block (breadcrumb, h1, description, chips) | `new: legal/LegalHero.tsx` | `PageHero` does not fit: it is a marketing hero with an 88px h1, `Circle` animations, two CTAs and a fixed 160px top padding. It has no slots for a breadcrumb, chips or a switcher, and extending it would need about 6 conditional props. Chips render as a `meta` array `.map()`. The breadcrumb's "Legal" is plain text. |
| Document switcher | `new: legal/LegalSwitcher.tsx` | `legalDocuments.map()` → `next/link` pills with `aria-current="page"`, active `bg-black text-white`, inactive `border-black/10`, `min-h-11`. `Button` does not fit: it is `h-14`, uses `whitespace-nowrap` and has a translate hover, and two of them would not fit at 375px. |
| "At a glance" card | `new: legal/LegalSummary.tsx` | `doc.summary.map()` → `<li>` items. Card style: `bg-bg_item`, `rounded-lg`, 2-column grid from `md`. Each item stays an inline `<li>`; no separate item component. |
| Check mark | `extend: src/components/ui/Icon.tsx` (sprite) | Add a `check` symbol to `public/icons/sprite.svg`, following the existing viewBox conventions, and render it with `Icon` inside an accent circle. `Icon` needs no prop change. |
| Numbered section | `new: legal/LegalSection.tsx` | `doc.sections.map()` in `LegalPage`. Renders `<section id aria-labelledby class="scroll-mt-32">` with the number in `text-black/40 tabular-nums`, the `h2`, and the `#` anchor (`opacity-40` below `lg`; from `lg`, hidden until hover or focus-visible; `aria-label="Link to <heading>"`). `paragraphs.map()` and `list.map()` render the body, and list items get custom dot markers. A `border-t` divider separates sections. |
| TOC scroll-spy logic | `new: legal/useActiveSection.ts` | Hook: `useActiveSection(ids) → activeId`. Details in §2.5. |
| TOC desktop + mobile | `new: legal/LegalToc.tsx` | Client component with a `variant: 'desktop' \| 'mobile'` prop. Desktop: `nav` with `sticky top-28 self-start`. Mobile: a `<details>` card with `lg:hidden` and a custom chevron. Two instances in different grid slots, with distinct `aria-label`s. |
| TOC list | `new: legal/LegalTocList.tsx` | `items.map()` with `{ id, label, number }`. Active item: `font-bold text-black`, a 2px left bar and `aria-current="true"`; others `text-black/60`. Shared by both TOC variants. |
| Contact card + "Also read" | `new: legal/LegalContactCard.tsx` | Black card; the heading differs per document ("this policy" / "these terms"). The email is shown as text with `break-all`. "Also read" uses `getOtherLegalDocs(slug).map()` → `next/link`. Links inside the card get `focus-visible:outline-white`. |
| "Email us" CTA | `extend: src/components/ui/Button.tsx` | Add `btnType: 'accent'` (`bg-accent text-black`). Render a plain `<a>` when `href` starts with `mailto:`, `tel:` or `http`; internal hrefs keep using `next/link`. |
| Contact form at bottom | `reuse: src/components/letsTalk/LetsTalk.tsx` | Unchanged. `LegalPage` wraps it in a `print:hidden` div. Do not touch the file: it is already flagged as multi-component. |
| Barrel | `new: legal/index.ts` | Re-exports the public legal components. Regenerate `components-index.md` afterwards. |

**Data arrays driving `.map()`:** `legalDocuments` (switcher and "Also read"), `doc.summary`, `doc.sections`,
`getTocItems(doc)` (both TOC variants), `section.paragraphs`, `section.list`, and the hero `meta` chips.

**Page grid**, rendered by `LegalPage`:

- `.container` holds `LegalHero` at full width.
- Below it, a grid from `lg`: `grid-cols-[240px_minmax(0,1fr)] gap-16`.
  - **Left column:** `<aside class="hidden lg:block print:hidden">` containing `LegalToc` with `variant="desktop"`.
  - **Right column:** `<article class="max-w-[72ch] break-words print:max-w-none">` containing, in order:
    - `LegalToc` with `variant="mobile"`;
    - `LegalSummary`;
    - the intro;
    - the `LegalSection` list;
    - `LegalContactCard`.
- After the container: `<div class="print:hidden">` holding `<LetsTalk />`.

`minmax(0,1fr)` and `break-words` prevent sideways scrolling at 375px, for example from a long email address.

Top padding follows `CaseHero` (`pt-[140px] lg:pt-[120px]`). Use only the existing colour tokens (`accent`, `bg_item`, `muted_text`, and `black` with opacity). Add no new colours.

### 2.5 Logic: scroll-spy (`useActiveSection`)

- In `useEffect`, observe each section element with an `IntersectionObserver`. Use pixel `rootMargin` that matches the sticky header, for example `-120px 0px -65% 0px`.
- Keep the set of intersecting ids in a ref. The active id is the **first id in TOC order** that is in the set. When the set is empty, keep the previous active id, so the highlight does not flicker.
- **Edge cases:**
  - Initial state is the first id, or `location.hash` if it matches an item.
  - At the bottom of the page (`innerHeight + scrollY >= scrollHeight - 2`), force the last id. Use a passive scroll listener and clean it up on unmount.
- Navigation uses native hash links only, with no JS scrolling. Smooth scrolling already sits behind `prefers-reduced-motion: no-preference` in `globals.css`, so the reduce-motion acceptance criterion holds without extra code.
- **Mobile `<details>`:** keep it uncontrolled (no React `open` prop). The link's `onClick` sets `ref.current.open = false` and does not call `preventDefault`.
- `LegalToc` receives only serializable `items`, so the legal text stays out of the client bundle.

---

## 3. Impact and Risk Analysis

**System dependencies**

- Other code links to these URLs and must keep working: the footer (`PrivacyAndTerms.tsx`), the `LetsTalk` consent line and `sitemap.ts`. The URLs do not change.
- `layout.tsx` (the overflow fix and print classes), `Button.tsx` (new variant) and `sprite.svg` are shared across the whole site.
- Spec 002 will later reword the contact-form paragraph in `privacy.ts`. That is out of scope here, and the existing TODO stays.

**Potential risks and mitigations**

| Risk | Mitigation |
|---|---|
| `overflow-x-clip` changes every page. Something may have relied on the wrapper clipping, such as the marquee or `Circle`. | Separate commit. Check the home, portfolio and case pages and the mobile menu at 375px with `scrollWidth === innerWidth`. `PageHero` already clips itself. |
| Off-by-one date when building west of UTC | `timeZone: 'UTC'` in `formatLegalDate`, plus a test (§4). |
| The ISO format is not type-checked, because both formats are `string` | Covered by the date test; optionally use a template-literal type. |
| Page-level `openGraph` drops the root OG image | `DEFAULT_OG_IMAGE` constant shared with `layout.tsx`. Check `og:image` in the page head. |
| Short last section never becomes active | Bottom-of-page rule in `useActiveSection`. |
| Hash target hidden under the sticky header | `scroll-mt-32` on each `<section>`. Measure the real header height and adjust. |
| Duplicate section ids | `getTocItems` throws during the static build. |
| Invisible focus ring on the black card | `focus-visible:outline-white` on links inside the card. |
| The `LegalSection` type and component share a name | Rename the type to `LegalSectionData`. |
| `privacy.ts` `lastUpdated` is currently "October 14, 2026", and the new sections change the policy | Set the ISO date to the actual ship date of the new sections. |

---

## 4. Testing Strategy

**Confirmed:** add one consolidated Playwright end-to-end file. This needs `@playwright/test` as a new devDependency, a root `playwright.config.ts` whose `webServer` runs `next build && next start` on a spare port, and an `npm run test:e2e` script. It is separate from `tools/mockup`.

One file, **`tests/e2e/legal-pages.spec.ts`**, covers the acceptance criteria in grouped `describe` blocks, run for both documents where it applies:

| Group | What it checks |
|---|---|
| Helpers (no browser) | `formatLegalDate`, `getReadingMinutes` (minimum 1, rounded up) and `slugify`. Write the date test first, and confirm it fails when `timeZone` is removed. |
| Header and switcher | Breadcrumb text, and that "Legal" is not a link. The "Updated <full date>" label, with the page loaded once in an `America/Los_Angeles` context. "N min read". Switcher states and navigation. |
| Summary | Exactly 4 items. Two columns at 768px, one column at 375px. |
| Sections and anchors | Numbers 01…N with no gaps. `#` hidden or visible on hover at desktop, faded at 375px. Clicking `#` updates the URL. `/privacy-policy#cookies-and-analytics` puts the heading below the header's bounding box. Custom list markers. |
| TOC | Pinned while scrolling at desktop. Active item after scrolling, on first load and at the very bottom. At 375px, the `<details>` starts collapsed and closes after a tap. With `reducedMotion: 'reduce'`, the jump has no animation. |
| Contact card | Heading per document, `mailto:` href, "Also read" target. |
| Mobile, keyboard, print | At 375px, `scrollWidth === innerWidth` and the switcher fits on one line. Tab order with a visible outline, including on the black card. With `emulateMedia({ media: 'print' })`, the TOC, switcher, CTA, LetsTalk, header and footer are hidden. |
| SEO | `og:title`, `og:description` and `og:image` on each page. JSON-LD parses. |

Checks to run as well: `npm run lint`, `npm run tsc`, and `npm run build`, where both routes must stay
`○ (Static)`. Validate the JSON-LD once in Google's Rich Results Test.

If the owner rejects the new devDependency, fall back to the manual checklist with the same groups. The date
helper then remains the main untested regression risk.
