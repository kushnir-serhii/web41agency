# System Architecture Overview: Web41 Agency Website

> Seeded from the codebase as of 2026-10-14. Internationalisation, chat, testing and paths updated 2026-10-16. Each item is tagged:
> **[in code]**: built, with file evidence. **[planned]**: decided in a spec, not built yet.
> **[assumption]**: a best-practice default, waiting for owner confirmation.

---

## 1. Application & Technology Stack

- **Language:** TypeScript 5 (strict type check via `tsc --noEmit`). **[in code]** `package.json`, `tsconfig.json`
- **Web framework:** Next.js 15.5 with the App Router. Pages are server-rendered or static by default. **[in code]** `package.json`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/**/page.tsx`
  - _Alternatives:_ Astro (lighter for a pure marketing site), but Next.js is already in place and supports the API routes needed for specs 002 and 004.
- **UI library:** React 19. **[in code]** `package.json`
- **Styling:** Tailwind CSS 4 via PostCSS, with `clsx` + `tailwind-merge` (`cn` helper). **[in code]** `postcss.config.mjs`, `src/app/globals.css`, `src/utils/cn.ts`
- **Animation & sliders:** `motion` 12, `swiper` 12. **[in code]** `package.json`, `src/components/slider/Slider.tsx`
- **Internationalisation (English + Ukrainian):** next-intl 4, plugged in through `createNextIntlPlugin` in `next.config.ts`. **[in code]** spec 005
  - _Routing:_ locales `en` (default) and `uk`. With `localePrefix: 'as-needed'`, English has no prefix and Ukrainian lives under `/uk`. All pages sit under `src/app/[locale]/` and are pre-rendered for both locales through `generateStaticParams`. **[in code]** `src/i18n/routing.ts`, `src/app/[locale]/layout.tsx`
  - _Locale detection:_ next-intl's built-in detection and cookie are off. `src/middleware.ts` runs the next-intl middleware and adds one rule of its own: on the first visit to `/` only, it sends a 307 redirect to `/uk` when the `NEXT_LOCALE` cookie or `Accept-Language` asks for Ukrainian, with `Vary: Accept-Language, Cookie`. Deep links are never redirected. **[in code]** `src/middleware.ts`, `src/i18n/detectLocale.ts`
  - _Strings & content:_ UI strings live in `messages/{en,uk}.json`, loaded per request by `src/i18n/request.ts`. Content (services, pricing, case studies, legal) comes from locale-aware accessors `getX(locale)` in `src/content/*`. Pages show no prices. The AI assistant quotes "from $X" in USD in both languages. The Ukrainian legal documents are separate files. **[in code]** `messages/`, `src/content/legal/{privacy,terms}.uk.ts`
  - _Navigation & switcher:_ locale-aware `Link`/`useRouter` come from `src/i18n/navigation.ts`. A language switcher in the header keeps the current page and stores the visitor's choice in `NEXT_LOCALE`. **[in code]** `src/components/layout/LanguageSwitcher.tsx`, `src/consts/locales.ts`
  - _Server side:_ `/api/chat` and `/api/contact` take a `locale` field (default `en`). The chat builds a Ukrainian system prompt with a language rule, a glossary and `/uk` links. Lead messages show the visitor's language and the page URL with its `/uk` prefix. **[in code]** `src/server/chat/systemPrompt.ts`, `src/server/contact/{validate,formatLead}.ts`
  - _Alternatives:_ next-i18next or a hand-rolled dictionary. next-intl is the App Router default and supports static rendering.
- **Fonts:** self-hosted Fixel Display via `next/font/local`. **[in code]** `src/fonts/fixelDisplay.ts`, `public/fonts/fixelDisplay/`
- **Server logic:** Next.js Route Handlers (`src/app/api/*/route.ts`) for the contact form and the chat. Provider code stays in `src/server/*`, so a provider can be swapped in one file. **[in code]** `src/app/api/{contact,chat}/route.ts`, `src/server/*`

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
- **Configuration:** environment variables. Public: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` **[in code]** `.env.example`. Server-only: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` **[in code]** `src/server/contact/telegram.ts`; `OPENAI_API_KEY`, `OPENAI_MODEL`, plus the public flag `NEXT_PUBLIC_CHAT_ENABLED` **[in code]** `.env.example`, `src/server/chat/config.ts`.
- **SEO:** generated `sitemap.ts`, `robots.ts`, metadata per page, redirects in `next.config.ts`. **[in code]** Metadata and the sitemap are locale-aware. Every page has a canonical URL plus `hreflang` alternates (`en`, `uk`, `x-default`). **[in code]** `src/i18n/metadata.ts`, `src/app/sitemap.ts`
- **Build & tooling:** npm (`package-lock.json`), Turbopack for dev, ESLint 9 flat config (`eslint-config-next`, Prettier, simple-import-sort), Prettier 3. **[in code]** `package.json`, `eslint.config.mjs`, `.prettierrc`
- **CI/CD:** Vercel Git integration (preview deploy per branch, production from `main`). Add a GitHub Actions job for `lint` + `typecheck` on pull requests. **[assumption]**: no pipeline config exists today.
- **Testing:** Vitest 5 for unit tests of server and i18n logic (`src/**/*.test.ts`, node environment). Playwright 1.64 for end-to-end tests in Chromium against a dev server on port 3100, covering chat, contact form, i18n and legal pages. **[in code]** `vitest.config.ts`, `playwright.config.ts`, `tests/e2e/*.spec.ts`. A separate Playwright tool in `tools/mockup` takes portfolio screenshots.

---

## 4. External Services & APIs

- **Lead notifications (contact form):** Telegram Bot API `sendMessage` (HTML, 10 s timeout), called from `POST /api/contact` (`src/app/api/contact/route.ts`) through `src/server/contact/{validate,formatLead,telegram}.ts`. Returns 503 when the bot env vars are missing, and the form falls back to `mailto:`. Spec 002's Resend plan is superseded: the owner chose Telegram over email. **[in code]** spec 005
  - _Alternatives:_ a transactional email provider (Resend, Postmark) if email delivery is required later.
- **AI pre-sales assistant:** OpenAI API (`openai` SDK), with a small, fast model set by `OPENAI_MODEL`, a monthly spend cap and a per-IP limit. Streaming responses, system prompt per locale. **[in code]** `src/app/api/chat/route.ts`, `src/server/chat/*`, spec 004
  - _Alternative:_ Anthropic Claude API (only `src/server/chat/provider.ts` would change).
- **Spam protection:** hidden `website` honeypot field, plus per-IP rate limiting with prefix `contact`: 5 requests per 10 minutes and 20 per day. **[in code]** `src/app/api/contact/route.ts`
  - _Option:_ Cloudflare Turnstile if spam gets through. **[assumption]**
- **Authentication, payments:** none. These are out of scope in the product definition.
- **Fallback contact:** `mailto:` links. **[in code]** `src/content/ctaLinks.ts`

---

## 5. Observability & Monitoring

- **Analytics:** Vercel Web Analytics (cookieless, no personal data) for page views and conversion events `lead_form_submit`, `email_click`, `chat_open` and `chat_handoff_click`. Custom events require the Vercel Pro plan. Disclosed in the privacy policy. **[in code]** `src/app/[locale]/layout.tsx`, `src/utils/analytics.ts`, `src/content/legal/privacy.ts`
- **Logging:** Vercel function logs for API routes. Log failed email sends and chat errors without personal data. **[assumption]**
- **Performance:** Vercel Speed Insights or Lighthouse checks for Core Web Vitals. **[assumption]**
- **Cost guardrails:** OpenAI usage limit set in the OpenAI console, plus the per-IP chat rate limit in code. **[assumption]**: the console limit can't be verified from the repo. Spec 004
