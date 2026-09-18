# 001 — Design critique fixes (Home + Portfolio)

Source: design critique of 2026-09-18. The site looks consistent (lime + black,
pill buttons, plenty of whitespace), but visitors cannot convert: every CTA does
nothing, most of the H1 is unreadable, and the prices contradict each other.

Each task file is self-contained. An agent only needs this README (for the
conventions) and its own task file.

## Tasks

| # | File | Priority | Depends on |
|---|------|----------|------------|
| 01 | [01-env-config.md](01-env-config.md) | 🔴 prerequisite | — |
| 02 | [02-cta-links.md](02-cta-links.md) | 🔴 critical | 01 |
| 03 | [03-hero-heading.md](03-hero-heading.md) | 🔴 critical | — |
| 04 | [04-pricing-single-source.md](04-pricing-single-source.md) | 🔴 critical | — |
| 05 | [05-services-accordion.md](05-services-accordion.md) | 🟡 major | 04 |
| 06 | [06-how-it-works.md](06-how-it-works.md) | 🟡 major | 02 |
| 07 | [07-portfolio-case-studies.md](07-portfolio-case-studies.md) | 🔴 critical | — |
| 08 | [08-legal-pages-footer.md](08-legal-pages-footer.md) | 🔴 critical | 01 |
| 09 | [09-accessibility.md](09-accessibility.md) | 🟡 major | 02, 08 |

## Suggested waves (to avoid edit conflicts)

Tasks in the same wave touch different files, so they can run in parallel.

1. **Wave 1:** 01, 03, 04, 07
2. **Wave 2:** 02, 05, 08
3. **Wave 3:** 06, 09

Files that several tasks edit:
- `src/components/ui/Button.tsx`: 02 (link variant, aria-label) and then 09 (focus styles)
- `src/components/pageHero/PageHero.tsx`: 03 (heading, circle) and then 02 (CTA hrefs)
- `src/components/letsTalk/LetsTalk.tsx`: 01 (email), 02 (`id`), 08 (consent links) and 09 (labels)
- `src/components/layout/footer/*`: 01 (email), 08 (links, year) and 09 (aria, touch targets)

## Conventions

- Stack: Next.js 15 App Router, React 19, Tailwind v4 (`@theme inline` tokens in
  `src/app/globals.css`), `cn()` from `src/utils/cn.ts`.
- Content lives in `src/content/*.ts`. Components never hardcode copy, prices or
  contact data.
- Never hardcode the email or the site URL. Import them from `src/utils/site.ts` (task 01).
- Match the existing code style: named exports, `React.FC`, and few comments.
- Before you finish a task: `npm run tsc` and `npm run lint` pass, and you have checked the page at
  375 px and 1440 px widths.
- Tick the acceptance checklist in the task file when you finish.

## Decisions (from the owner)

- CTA target: scroll to the on-page form `#lets-talk`. Every page renders
  `<LetsTalk />`. Use `/contacts` only where no form is on the page.
- Pricing: simple landing pages **from $100**. The other prices are open. See task 04.
- Portfolio: build real case-study pages at `/portfolio/[slug]`.
- Legal: draft generic Privacy Policy and Terms templates, marked for legal review.
- The owner will add env values later. Add `.env.example` with keys and empty values.

## Out of scope, flagged

- **The contact form does not send anything.** `LetsTalk.handleSubmit` only runs
  `console.log`. So after the CTAs are fixed, leads are still lost. This needs its own
  spec (API route + email provider).
- The Services page and Contacts page content (see `docs/seo-plan-en.md`).
