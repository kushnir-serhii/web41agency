# System Architecture Overview: Web41 Agency Website

> Seeded from the codebase as of 2026-10-14. Each item is tagged:
> **[in code]**: built, with file evidence. **[planned]**: decided in a spec, not built yet.
> **[assumption]**: a best-practice default, waiting for owner confirmation.

---

## 1. Application & Technology Stack

- **Language:** TypeScript 5 (strict type check via `tsc --noEmit`). **[in code]** `package.json`, `tsconfig.json`
- **Web framework:** Next.js 15.5 with the App Router. Pages are server-rendered or static by default. **[in code]** `package.json`, `src/app/layout.tsx`, `src/app/(root)/**/page.tsx`
  - _Alternatives:_ Astro (lighter for a pure marketing site), but Next.js is already in place and supports the API routes needed for specs 002 and 004.
- **UI library:** React 19. **[in code]** `package.json`
- **Styling:** Tailwind CSS 4 via PostCSS, with `clsx` + `tailwind-merge` (`cn` helper). **[in code]** `postcss.config.mjs`, `src/app/globals.css`, `src/utils/cn.ts`
- **Animation & sliders:** `motion` 12, `swiper` 12. **[in code]** `package.json`, `src/components/slider/Slider.tsx`
- **Internationalisation:** next-intl v4. `as-needed` prefix: English unprefixed, Ukrainian under `/uk`. UI strings in `messages/{en,uk}.json`, content through typed accessors in `src/content/*.ts`. **[in code]** `src/i18n/*`, `messages/`
- **Fonts:** self-hosted Fixel Display via `next/font/local`. **[in code]** `src/fonts/fixelDisplay.ts`, `public/fonts/fixelDisplay/`
- **Server logic:** Next.js Route Handlers (`src/app/api/*/route.ts`) for the contact form and the chat. Provider code stays in `src/server/*`, so a provider can be swapped in one file. **[planned]** specs 002, 004

---

## 2. Data & Persistence

- **Site content:** typed TypeScript modules in the repo (services, pricing, portfolio, case studies, FAQ, legal). One source of truth per fact, for example `PRICING` in `src/content/pricing.ts`. **[in code]** `src/content/*.ts`, `src/content/legal/*.ts`
  - _Alternatives:_ a headless CMS (Sanity, Contentful) if non-developers start editing content often. Not needed now.
- **Images:** static files in `public/images`, served through `next/image` (WebP). **[in code]** `public/images/`
- **Lead storage:** no database. Each lead is sent as a Telegram message to the agency chat. **[in code]** `src/server/contact/`
  - _Option:_ Neon Postgres (serverless, free tier, works on Vercel) to keep a copy of every lead in case Telegram delivery fails. **[assumption]**: owner decision pending.
- **Rate-limit state:** in-memory per instance for the first version. Move to Upstash Redis or Vercel KV if abuse appears. **[assumption]**

---

## 3. Infrastructure & Deployment

- **Hosting:** Vercel (serverless functions for API routes, edge CDN for static pages). **[in code]** `src/utils/site.ts` fallback URL, `src/content/legal/privacy.ts`, `README.md`
- **Configuration:** environment variables. Public: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` **[in code]** `.env.example`. Server-only: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` **[in code]** `src/server/contact/telegram.ts`; `OPENAI_API_KEY`, `OPENAI_MODEL` **[planned]** spec 004.
- **SEO:** generated `sitemap.ts`, `robots.ts`, metadata per page, redirects in `next.config.ts`. **[in code]**
- **Build & tooling:** npm (`package-lock.json`), Turbopack for dev, ESLint 9 flat config (`eslint-config-next`, Prettier, simple-import-sort), Prettier 3. **[in code]** `package.json`, `eslint.config.mjs`, `.prettierrc`
- **CI/CD:** Vercel Git integration (preview deploy per branch, production from `main`). Add a GitHub Actions job for `lint` + `typecheck` on pull requests. **[assumption]**: no pipeline config exists today.
- **Testing:** none today. Add Playwright smoke tests (home loads, CTA reaches `#lets-talk`, form submits) once the contact form backend ships. **[assumption]**. Playwright is already used in `tools/mockup` for screenshots.

---

## 4. External Services & APIs

- **Lead notifications (contact form):** Telegram Bot API `sendMessage` (HTML, 10 s timeout), called from `POST /api/contact` (`src/app/api/contact/route.ts`) through `src/server/contact/{validate,formatLead,telegram}.ts`. Returns 503 when the bot env vars are missing, and the form falls back to `mailto:`. Spec 002's Resend plan is superseded: the owner chose Telegram over email. **[in code]** spec 005
  - _Alternatives:_ a transactional email provider (Resend, Postmark) if email delivery is required later.
- **AI pre-sales assistant:** OpenAI API (`openai` SDK), with a small, fast model set by `OPENAI_MODEL`, a monthly spend cap and a per-IP limit. **[planned]** spec 004
  - _Alternative:_ Anthropic Claude API (only `src/server/chat/provider.ts` would change).
- **Spam protection:** hidden `website` honeypot field, plus per-IP rate limiting with prefix `contact`: 5 requests per 10 minutes and 20 per day. **[in code]** `src/app/api/contact/route.ts`
  - _Option:_ Cloudflare Turnstile if spam gets through. **[assumption]**
- **Authentication, payments:** none. These are out of scope in the product definition.
- **Fallback contact:** `mailto:` links. **[in code]** `src/content/ctaLinks.ts`

---

## 5. Observability & Monitoring

- **Analytics:** Vercel Web Analytics (cookieless, no personal data) for page views and conversion events `lead_form_submit` and `email_click`. Custom events require the Vercel Pro plan. Disclosed in the privacy policy. **[in code]** `src/app/layout.tsx`, `src/utils/analytics.ts`, `src/content/legal/privacy.ts`
- **Logging:** Vercel function logs for API routes. Log failed email sends and chat errors without personal data. **[assumption]**
- **Performance:** Vercel Speed Insights or Lighthouse checks for Core Web Vitals. **[assumption]**
- **Cost guardrails:** OpenAI usage limit set in the OpenAI console. **[planned]** spec 004
