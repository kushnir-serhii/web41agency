# Web41 Agency — technical fix plan

State as of 2026-09-11. Step 1 is done; steps 2–8 are open.
Geo/niche landing pages are deliberately out of scope — no city targeting yet.

---

## ✅ Step 1 — Metadata and indexing (DONE)

Files changed:

- `src/utils/site.ts` — **new**. Single source of truth for the public origin:
  `SITE_URL` reads `NEXT_PUBLIC_SITE_URL` and falls back to the vercel.app host.
- `src/app/layout.tsx` — removed `alternates: { canonical: "/" }`.
  **This was the main bug:** a canonical declared on the root layout is
  inherited by every page, so Google was told that `/portfolio` and `/about-us`
  are duplicates of the homepage. Also: title template is now
  `%s | Web41 Agency`, and the hardcoded `SITE` constant was replaced by `SITE_URL`.
- `src/app/(root)/page.tsx` — own canonical `/`.
- `src/app/(root)/portfolio/page.tsx` — canonical `/portfolio`; title changed
  from `"Portfolio | Web41"` to `"Portfolio"` (the template appends the brand
  suffix itself — the old value rendered as `Portfolio | Web41 | Web41`).
- `src/app/(root)/about-us/page.tsx` — added metadata + canonical.
- `src/app/(root)/services/page.tsx`, `src/app/(root)/contacts/page.tsx` —
  metadata + canonical + **`robots: { index: false }`**, because both pages are
  still placeholders. Remove the noindex together with the content work (step 4).
- `src/app/robots.ts` — **new**. `/robots.txt` previously returned 404.
- `src/app/sitemap.ts` — **new**. `/sitemap.xml` previously returned 404.
  Lists only pages that have real content.

Verify after deploy: `/robots.txt` and `/sitemap.xml` return 200, and in each
page's view-source the canonical points at that page, not at the homepage.

---

## Step 2 — Fonts (biggest performance win)

`src/fonts/fixelDisplay.ts` loads **9 weights of Fixel Display, 718 KB** — about
60% of total page weight, more than all the JavaScript. All 9 are preloaded.

1. Find which weights are actually used:
   `grep -rn "font-\(thin\|extralight\|light\|normal\|medium\|semibold\|bold\|extrabold\|black\)" src/`
   and check `globals.css` and the Tailwind config as well.
2. Keep 3 (likely `400`, `500`, `700`), drop the rest from the `src` array.
   The unused files under `public/fonts/` can be deleted too.
3. The files include Cyrillic, which an English-only site never renders. If more
   headroom is wanted after step 2, subset to Latin with `pyftsubset` — roughly
   another 4× reduction.

Expected: 718 KB → ~240 KB (step 2) → ~60 KB (with subsetting).
This lands directly on LCP, which is the metric the agency sells to clients.

---

## Step 3 — JSON-LD

There is no structured data on the site at all right now.

Add a `<script type="application/ld+json">` block in `src/app/layout.tsx` with
an `Organization` entity: `name: "Web41 Agency"`, `url: SITE_URL`, `logo`,
`email`, `address`, and `sameAs` listing the Instagram, Dribbble and
Freelancehunt profiles.

`sameAs` is the important part: it ties the scattered profiles into one entity
and separates this brand from `web41.com.br`, an unrelated Brazilian agency that
currently occupies the search results for "Web41".

**Do not add FAQPage schema** — Google dropped FAQ rich results in May 2026.

---

## Step 4 — Fill in `/services` and `/contacts`

Both are currently one-line placeholders, and both sit in the main navigation.
This is the most expensive loss on the site: someone who is already interested
clicks "Contacts" and lands on an empty page.

- `/services` — a list of services, each with a starting price and a timeline.
  Source content already exists in `src/content/servicesContent.ts`.
- `/contacts` — a form (reuse the existing `LetsTalk` component), an email
  address, messengers, and a physical address.
- After the content ships: remove `robots.index: false` from both files and add
  both paths back to `ROUTES` in `src/app/sitemap.ts`.

---

## Step 5 — Take down the Framer version (outside the codebase)

`https://web41.framer.ai/` is still published and indexed. Google surfaces **it**
rather than this site. It carries stale prices (from $500) and an old portfolio.

301 it to the new domain if the Framer plan allows; otherwise just unpublish it.

---

## Step 6 — Domain (outside the codebase)

`web41agency.com` currently 302-redirects to a Porkbun parking page
(`web41agency-com.l.ink`). The live site is served from `web41agency.vercel.app`.

1. Point Porkbun DNS at Vercel and turn off URL forwarding.
2. Add the domain to the Vercel project.
3. Set `NEXT_PUBLIC_SITE_URL=https://web41agency.com` in the Vercel environment.
   Nothing else in the code needs to change — step 1 routes everything through
   that variable.

---

## Step 7 — Email (outside the codebase)

`hello@web41.agency` in the footer **does not exist** — the domain
`web41.agency` does not resolve in DNS. It is the only contact on the site, and
it is dead.

Set up a mailbox on `web41agency.com` (Cloudflare Email Routing) and replace the
address in the footer and in `LetsTalk`.

---

## Step 8 — Analytics (outside the codebase)

No analytics, no Search Console, no verification. The site is currently blind.
Minimum: Vercel Analytics plus Google Search Console with the sitemap from
step 1 submitted.

---

## Non-technical, tracked separately

Three different price lists across three properties: **$500** (Framer),
**$800** (this site), **$180–340 / ~1000 PLN** (Freelancehunt bids).
These need to collapse into one grid.

The portfolio shows AI and crypto work, while actual paid engagements are
corporate sites and landing pages. Real client cases will carry more weight than
all the AI projects combined.
