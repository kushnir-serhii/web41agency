# 07 — Portfolio case-study pages + result context on cards

**Priority:** 🔴 critical. All 11 cards link back to `/portfolio`, which is a dead end.

## Problem
- `src/content/portfolioContent.ts`: every project has `href: '/portfolio'`.
- The cards show only an image, a title and tags. The headline promises "Websites that Drive
  Results", but no results appear anywhere.

## Steps
1. **Data model** (`portfolioContent.ts`). Replace `href` with the fields below:
   ```ts
   export interface IProject {
     slug: string;            // kebab-case, unique. Used in the URL
     image: StaticImageData;  // cover
     title: string;
     tags: string[];
     industry: string;        // e.g. "Fintech", "Construction"
     summary: string;         // 1–2 lines, shown on the card
     metric?: { value: string; label: string }; // e.g. { value: "+38%", label: "sign-ups" }
     client?: string;
     year?: number;
     services: string[];      // what we did
     challenge: string;       // case page: 1 paragraph
     solution: string;        // case page: 1–2 paragraphs
     results: { value: string; label: string }[]; // case page: 1–3 metrics
     gallery?: StaticImageData[];
     liveUrl?: string;
   }
   ```
   Fill in `slug`, `industry`, and a draft `summary`/`challenge`/`solution` from the title
   and tags. **Do not invent metrics.** Leave `metric`/`results` empty and mark them
   `// TODO(owner): real numbers`. Every drafted text gets `// TODO(owner): review`.
2. **Route** `src/app/(root)/portfolio/[slug]/page.tsx`:
   - `generateStaticParams` from `portfolioContent.projects`
   - `generateMetadata`: title = project title, description = summary, canonical
     `/portfolio/${slug}`, OG image = cover
   - `notFound()` for an unknown slug. Set `dynamicParams = false`
   - Layout: `PageHero`-style heading (title + industry), cover image, meta row
     (client · year · services · live link), sections Challenge / Solution / Results
     (results render as big numbers and are hidden when empty), gallery, then
     "Next project" link, then `<LetsTalk />`
3. **ProjectCard** (`src/components/portfolio/portfolioComponents/ProjectCard.tsx`):
   - `href = /portfolio/${slug}`
   - Add the industry label (small, muted) above the title, and the `summary` under it
     (limit it to 2 lines with `line-clamp-2`)
   - When there is a `metric`, show it as a lime chip: **value** + label
   - Give the image a meaningful `alt` (`${title} — ${industry}`) or `alt=""`. Right now the
     alt repeats the title
4. **Sitemap** (`src/app/sitemap.ts`): add every `/portfolio/${slug}` with priority 0.6.
5. Optional JSON-LD `CreativeWork` on the case page.

## Acceptance
- [x] Each card opens its own `/portfolio/<slug>`. An unknown slug returns 404
- [x] Case pages build statically (`next build` lists them as SSG)
- [x] Each case page has a unique title, description and canonical
- [x] No invented numbers. Every placeholder is marked TODO(owner)
- [ ] Cards show the industry and summary at 375 px and 1440 px without breaking the slider height
