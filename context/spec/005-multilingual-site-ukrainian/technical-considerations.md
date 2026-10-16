# Technical Specification: Multilingual Site — Ukrainian Version

- **Functional Specification:** [functional-spec.md](./functional-spec.md) · decisions: [decisions.md](./decisions.md)
- **Status:** Draft
- **Author(s):** Serhii Kushnir (drafted with Claude)

---

## 1. High-Level Technical Approach

Add locale routing with **next-intl v4** using `localePrefix: 'as-needed'`. English (`en`, default) keeps its current unprefixed URLs. Ukrainian (`uk`) is served under `/uk`. All page routes move from `src/app/(root)/*` to `src/app/[locale]/(root)/*`. The `<html lang>`, Header, Footer and Chat move into a locale layout. Pages stay statically rendered (locales × routes) through `generateStaticParams` and `setRequestLocale`.

Copy uses a **hybrid** model:

- Short UI strings (nav, buttons, form, aria-labels, chat UI, 404) live in `messages/{en,uk}.json`.
- Long structured content (services, FAQ, case studies, legal) stays in typed TS modules. Each module is split into non-translatable base data plus per-locale copy, and merged by a server-side `getX(locale)` accessor.

A thin custom middleware wraps the next-intl middleware. It does first-visit detection on `/` only, and the switcher sets the remembered-choice cookie.

Two existing server features become locale-aware:

- The chat API takes `locale` and picks a per-locale memoised system prompt.
- The contact form gets a backend. A new `POST /api/contact` sends each lead to the agency's **Telegram bot** chat instead of email. This supersedes spec 002's Resend plan, per the owner's decision. Each lead message includes "Language: Ukrainian/English".

SEO gets per-page `hreflang` alternates and a bilingual sitemap.

---

## 2. Proposed Solution & Implementation Plan

### 2.1 Architecture Changes

| Area | Change |
|---|---|
| Dependency | Add `next-intl` (v4). Wrap `next.config.ts` with `createNextIntlPlugin('./src/i18n/request.ts')`. |
| `src/i18n/routing.ts` | `defineRouting({ locales: ['en','uk'], defaultLocale: 'en', localePrefix: 'as-needed', localeDetection: false, localeCookie: false })`. Built-in detection and cookie are off because the spec limits detection to `/` and remembers only an explicit choice. |
| `src/i18n/navigation.ts` | `createNavigation(routing)` exports `Link`, `usePathname`, `useRouter`, `redirect`, `getPathname`. **Every** `next/link` and `next/navigation` (`usePathname`/`useRouter`) import in components switches to these, or links silently drop the `/uk` prefix (AC 2.4 "links stay in Ukrainian"). |
| `src/i18n/request.ts` | `getRequestConfig` awaits `requestLocale`, validates it with `hasLocale` and falls back to `en`. Returns `{ locale, messages }`. |
| `src/i18n/types.ts` | `declare module 'next-intl' { interface AppConfig { Locale; Messages: typeof en } }` for typed keys. |
| `src/middleware.ts` (new) | Runs the home-page detection rule (§2.5), then delegates to `createMiddleware(routing)`. Matcher: `'/((?!api|_next|_vercel|.*\\..*).*)'`, which excludes `/api/*`, static files, `sitemap.xml` and `robots.txt`. |
| `src/app/layout.tsx` | Becomes a passthrough (`return children`). |
| `src/app/[locale]/layout.tsx` (moved from root) | Awaits `params` and runs `hasLocale` (else `notFound()`) and `setRequestLocale`. Renders `<html lang={locale}>`, JSON-LD, Header, Footer, ChatLoader, Analytics. Wraps the tree in `NextIntlClientProvider` with **picked** client namespaces only (`Header`, `LanguageSwitcher`, `LetsTalk`, `Chat`), so legal and page copy is not shipped to the client. |
| `src/app/[locale]/(root)/**` | Every current page moves here unchanged in structure. Each page calls `setRequestLocale(locale)` and replaces static `metadata` with `generateMetadata`. `portfolio/[slug]` emits locales × slugs in `generateStaticParams`, and `dynamicParams = false` stays. |
| `src/app/[locale]/not-found.tsx` + `src/app/[locale]/[...rest]/page.tsx` | Localized 404, reached by unknown paths under `/uk` (catch-all calls `notFound()`). |
| `src/app/not-found.tsx` | Root fallback with its own `<html>`/`<body>` for invalid-locale cases. English. |
| `src/app/api/*`, `sitemap.ts`, `robots.ts` | Stay outside `[locale]`. |
| `next.config.ts` | Add a `/uk/portfolio/saas-landing-page → /uk/portfolio/investico` twin of the existing redirect. |
| Fonts | `next/font/local` has no `subsets` option. The current full Fixel Display woff2 files (~80 KB each) must contain Cyrillic. Verify the glyphs during implementation. If they are missing, add the Cyrillic files. |

Slugs (`/portfolio/<slug>`, `/privacy-policy`, `/terms-of-use`, `/about-us`, …) are **identical in both locales**. Only the prefix differs, which keeps `hreflang` and the switcher trivial (path in, path out).

### 2.2 Content Model

**Translation layers**

| Layer | Location | What lives there | Parity guard |
|---|---|---|---|
| UI messages | `messages/en.json`, `messages/uk.json` | Namespaces: `Header`, `Footer`, `Nav`, `LanguageSwitcher`, `Cta`, `LetsTalk` (labels, placeholders, validation, success/error), `Chat` (all of `CHAT_COPY`, greeting, suggestions), `Legal` (Last updated, min read, "English version prevails" note, breadcrumbs), `NotFound`, `Meta` (page titles/descriptions), `Common` (aria-labels, image alts not tied to content). | Vitest key-parity test (§4). |
| Structured content | `src/content/*.ts` | Base data (ids, slugs, images, tags, stack, prices, URLs) stays as is. Translatable fields move into a `Record<Locale, Record<id, Copy>>` declared with `satisfies`. Example: `servicesCopy.uk['landing-page'] = { title, description, timeline }`. | TypeScript: the `uk` record must have every id and field. |
| Accessors | Next to each module, e.g. `getServices(locale)`, `getFaq(locale)`, `getCaseStudy(slug, locale)`, `getPortfolio(locale)`, `getLegalDocument(slug, locale)` | Merge base + copy. Called from **server** components only. Client components get the result as props. | — |

**Modules affected:** `servicesContent`, `faqContent`, `howItWorksContent`, `whyChooseContent`, `portfolioContent`, `caseStudiesContent` and `caseStudyTitles`, `techStackIconsArray` (captions), `navBarArray` (labels become message keys and hrefs stay), `chatContent` (moves to messages; `CHAT_NO_TEASER_PATHS` stays as locale-agnostic paths), `legal/privacy.ts` and `legal/terms.ts`.

**Legal documents**

- Ukrainian versions are full `LegalDocument` objects in `legal/privacy.uk.ts` and `legal/terms.uk.ts`. The section structure differs too much for field-level merging.
- `legalDocuments` becomes `Record<Locale, LegalDocument[]>`.
- `LegalDocument` gets an optional `prevailingNote?: string`, used only by `uk`.
- `lastUpdated` must be equal across locales. A test enforces this.

**Dates.** `formatLegalDate(iso, locale)` uses `Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' })`. The uk output is "15 жовтня 2026 р.". The trailing "р." is the standard Ukrainian long form.

**Prices.** `formatUsd` and `PRICING` are unchanged and USD-only. No price is displayed on pages (per decisions).

### 2.3 Component Breakdown

| Item | Tag | Notes |
|---|---|---|
| Language switcher | `new: layout/LanguageSwitcher.tsx` | No existing component offers two-option locale navigation. `LegalSwitcher` switches documents, not locales, and has different semantics. Client component. Prop `variant: 'pill' \| 'full'`. Renders `LOCALE_OPTIONS` (in `src/consts/locales.ts`: `{ locale, short: 'EN'\|'UA', endonym: 'English'\|'Українська' }`) via `.map()` → one `LanguageSwitcherOption`. Wrapper `role="group"` with localized `aria-label` ("Language selection" / "Вибір мови"). |
| Switcher option | `new: layout/LanguageSwitcherOption.tsx` | Single item component for the map above. Active option: `<span aria-current="true">` on `bg-accent` (no link, so re-selecting does nothing, AC 2.2). Inactive option: next-intl `Link` to `usePathname()` with `locale` prop, plus `lang`, `hrefLang` and `aria-label={endonym}`. The visible text is `short` on pill and `endonym` on full. On click it sets the `NEXT_LOCALE` cookie (1 year, `SameSite=Lax`) **before** navigating. It does this for `en` too, so `/uk → /` does not bounce back. Uses `scroll` to the top. Visible `focus-visible` ring. |
| Header | `extend: src/components/layout/Header.tsx` | Adds a pill switcher at the right end of the desktop bar (after `NavBar`). Adds a full switcher in the mobile menu above Free Quote. "Free Quote" and the menu aria-labels come from messages. Uses next-intl `usePathname` for the active state. |
| NavBar / NavBarItem | `extend: src/components/layout/navBar/NavBar.tsx`, `reuse: …/NavBarItem.tsx` (swap import to next-intl `Link`) | Labels come from `Nav` messages, mapped over `navBarArray` hrefs. |
| Footer, PrivacyAndTerms, SocialList | `extend: src/components/layout/footer/*` | Strings and links via messages and next-intl `Link`. |
| Button | `reuse: src/components/ui/Button.tsx` | Swap the internal link import to next-intl `Link`. No API change. |
| LetsTalk form | `extend: src/components/letsTalk/LetsTalk.tsx` | All copy from `LetsTalk` messages. Client validation messages are keys. Replaces the `console.log` with a `POST /api/contact` and adds submitting, success and error states. Server error codes map to localized messages. Submits `locale` (from `useLocale()`) and the locale-less `page`. Adds a visually hidden honeypot input. `RequiredMark` moves to its own file `letsTalk/RequiredMark.tsx` (one component per file). |
| Home sections: Hero, Services/ServiceItem, HowItWorks*, WhyChoose*, TechStack, Portfolio/PortfolioGrid/ProjectCard, Faq/FaqItem, About, PageHero | `extend: <each path>` | They receive localized data as props from the page (server) via accessors, or read section titles through `getTranslations`/`useTranslations`. No layout changes. Image `alt` text comes from localized copy. |
| Case study components (`caseStudy/*`) | `reuse: src/components/caseStudy/*` | Already prop-driven. The page passes `getCaseStudy(slug, locale)`. Only fixed labels (e.g. "Results", "Next case") move to messages. `CaseCta` extends to use the next-intl `Link`. |
| Legal components | `extend: src/components/legal/LegalHero.tsx`, `LegalPage.tsx`, `LegalContactCard.tsx`, `LegalSwitcher.tsx` | `LegalPage` gets `locale` and passes `formatLegalDate(iso, locale)`. `LegalHero` renders `doc.prevailingNote` near the top when present. Breadcrumb and labels come from messages. `LegalSwitcher` uses the next-intl `Link`. |
| Chat widget (`chat/*`) | `extend: src/components/chat/ChatMessageList.tsx`, `ChatHeader`, `ChatComposer`, `ChatLauncher`, `ChatTeaser`, `ChatSuggestions`, `ChatErrorNotice`, `ChatLimitNotice`, `ChatLongNote`, `ChatHandoff`, `ChatEmailLink`, `ChatIconButton` labels; hooks `useChat.ts`, `useHandoffNavigate.ts`, `useChatTeaser.ts` | `CHAT_COPY`/`CHAT_GREETING`/`CHAT_SUGGESTIONS` move to `Chat` messages (suggestions stay a mapped array). `useChat` sends `locale`. `useHandoffNavigate` uses the next-intl `useRouter().push('/#lets-talk')` and `usePathname()`, so uk visitors land on `/uk#lets-talk`. `useChatTeaser` compares the locale-less pathname with `CHAT_NO_TEASER_PATHS`. `chatStorage` is **unchanged**: one sessionStorage history across locales (spec: keep the conversation, old messages are not translated). |
| 404 page | `new: notFound/NotFoundContent.tsx` | No 404 UI exists today. Used by `[locale]/not-found.tsx`: heading, text and a next-intl `Link` home (`/` or `/uk`). |

### 2.4 API Contracts

**`POST /api/chat`** (modified)

- Request: `{ messages: IChatMessage[], locale?: 'en' | 'uk' }`.
  - If `locale` is missing, the server uses `'en'`.
  - Any other value returns `400 { error: 'invalid_request' }`.
- `parseChatRequest` returns `{ ok: true, messages, locale }`.
- Response, rate limiting, body cap and error codes are unchanged. The rate-limit key stays IP-only.

**`POST /api/contact`** (new; built in 005, replaces spec 002's email plan with Telegram)

- Request: `{ name, email, message, locale: 'en' | 'uk', page, website /* honeypot */ }`.
  - `name`: required, at most 100 characters.
  - `email`: required, valid format, at most 200 characters.
  - `message`: optional, at most 2000 characters, which keeps it under Telegram's 4096-character limit.
  - `locale`: validated like the chat field, default `'en'`.
  - `page`: the locale-less path the form was sent from, at most 200 characters.
- Success: `200 { ok: true }`. A filled honeypot also returns `200` but sends nothing.
- Errors come back as codes only:
  - `400 { error: 'validation', fields: { name?: 'required', email?: 'required' | 'invalid' } }`
  - `429 { error: 'rate_limited', retryAfter }`
  - `502 { error: 'unavailable' }`
- The client maps each code to a localized message. On `502` it also shows the `mailto:` fallback.
- **Files:**
  - `src/app/api/contact/route.ts`: body cap, parse, honeypot, rate limit, send.
  - `src/server/contact/validate.ts`: `parseContactRequest`.
  - `src/server/contact/formatLead.ts`: builds the Telegram message text.
  - `src/server/contact/telegram.ts`: provider. `sendTelegramMessage(text)` calls Bot API `POST https://api.telegram.org/bot<TOKEN>/sendMessage` with `{ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true }` and a 10 s timeout. Only this file changes if the provider changes later.
  - Rate limiting reuses `src/server/rate-limit/createRateLimiter.ts` with prefix `contact` (e.g. 5 per 10 min and 20 per day per IP) via `getClientIp`.
- **Lead message format** (HTML parse mode; every user field is HTML-escaped):
  - `🆕 New lead — Web41`
  - `Name: …` / `Email: …` / `Language: Ukrainian | English` / `Page: /uk/services`
  - `Message:` followed by the message text, or `—` when empty
- **Env vars** (server-only, added to `.env.example` and Vercel):
  - `TELEGRAM_BOT_TOKEN`: the bot token from @BotFather.
  - `TELEGRAM_CHAT_ID`: the agency chat or group that receives leads. The bot must be a member of it.
  - If either is missing, the route returns `503 { error: 'disabled' }` and the form shows the `mailto:` fallback.

### 2.5 Logic

**First-visit language (middleware, path `/` only)**

1. If the request path is exactly `/`:
   - If the `NEXT_LOCALE` cookie is `uk`, return a 307 redirect to `/uk`.
   - If the cookie is `en`, serve English.
   - With no cookie, parse `Accept-Language` by q-value. If the top-ranked language among those the site supports is `uk`, return a 307 to `/uk`. Otherwise serve English.
   - Set `Vary: Accept-Language, Cookie` on the redirect.
2. Every other path goes straight to the next-intl middleware. No redirect is made based on cookie or browser language, so direct links are never redirected.
3. The middleware never sets the cookie. Only the switcher does (explicit choice).

**Chat system prompt**

- `buildSystemPrompt(locale)` returns one of two **memoised** strings (`promptByLocale.en` / `.uk`), built once at module load by `buildBlocks(locale)`.
- The two differ only in two places:
  - The role/language rule. uk: "The visitor is on the Ukrainian version. Reply in Ukrainian. If the visitor writes in another language, reply in that language." It is stated once and does not conflict with the existing "visitor's language" rule.
  - Page links: `/uk/services`, `/uk#lets-talk`, etc.
- The knowledge base (services, pricing, FAQ, how-it-works, case study titles) **stays English and single-sourced**.
- A short uk glossary block maps English service names to their Ukrainian site names, so replies use the site's own terms.
- `HANDOFF_TOKEN` and USD "from $X" are identical in both locales.

### 2.6 SEO

- **Metadata helper.** `src/i18n/metadata.ts` exports `buildPageMetadata({ locale, path, title, description, ogType?, images? })`. It returns:
  - `alternates`: `canonical` set to the locale's own URL, plus `languages: { en, uk, 'x-default': en }`.
  - `openGraph`: `{ locale: 'en_US' | 'uk_UA', alternateLocale, url, siteName, title, description, images }`.
  - `twitter`.
- **Root layout metadata.** It keeps only locale-neutral fields (`metadataBase`, `title.template`, `robots`, `icons`). It sets no `alternates`, to avoid an inherited wrong canonical (an existing lesson, see the `layout.tsx` comment). The default title/description come from `Meta` messages via `generateMetadata`.
- **JSON-LD.** Organization and CreativeWork are localized with `inLanguage`, the locale `url` and a translated `description`.
- **Sitemap.** `sitemap.ts` emits one entry per route per locale. Each entry carries `alternates.languages` `{ en, uk }`. Legal `lastModified` stays per document.

---

## 3. Impact and Risk Analysis

### System Dependencies

- **Spec 002 (contact-form backend) is superseded.** The owner chose a Telegram bot over email, so 005 builds `/api/contact` itself (§2.4) and 002's Resend plan is dropped.
  - `context/product/architecture.md` §2–§4 still name Resend and the `RESEND_*`/`CONTACT_*` env vars. Update them to Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
  - Functional spec AC 2.5 says the request arrives "in the agency inbox". Read "inbox" as the agency's Telegram chat.
- **Spec 004 (chat).** Request contract, system prompt builder, client hooks and copy change. Existing chat e2e tests (`tests/e2e/chat.spec.ts`) must keep passing on English URLs.
- **Spec 003 (legal pages).** Legal components gain locale support. `tests/e2e/legal-pages.spec.ts` must keep passing.
- **Analytics.** Add `locale` to `lead_form_submit`, `email_click` and `chat_handoff_click` props in `src/utils/analytics.ts`, so Ukrainian conversions are measurable.

### Potential Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Existing English URLs break or start redirecting (AC 2.1). | `as-needed` prefix, `localeDetection: false`, and redirects only on `/`. An e2e test asserts the status is 200 with no redirect for every legacy URL in the sitemap. |
| A missed `next/link` / `next/navigation` import drops the `/uk` prefix. | ESLint `no-restricted-imports` bans `next/link` and the `usePathname`/`useRouter`/`redirect` named imports of `next/navigation` in `src/components` and `src/app/[locale]`. An e2e test crawls every `/uk` page and asserts all internal `href`s start with `/uk`. |
| Pages fall out of static rendering. | Call `setRequestLocale` in every layout and page, and no `headers()`/`cookies()` in pages. Check that `next build` output still shows `○`/`●` for all pages. |
| The client bundle grows with all messages. | Pass picked namespaces to `NextIntlClientProvider`. Structured content stays server-only. |
| The Header overflows: uk nav labels run about 15–25% longer and the pill adds width. | Visual check at 1024–1280px. The pill is compact ("EN \| UA"). If needed, reduce the nav gap on `lg`. Playwright screenshots at 1024 and 1280. |
| Missing or out-of-sync uk strings show English (AC "no English sentences"). | Key-parity test for JSON. `satisfies` records for TS copy. The owner proofreads before launch. |
| Cyrillic glyphs are missing in Fixel woff2, causing a fallback font. | Verify the glyph coverage of the current files early (first task). Add Cyrillic files if needed. |
| The chat replies with English site terms on uk. | Ukrainian glossary block in the uk prompt. Manual spot-check of the AC question "Скільки коштує лендінг?". |
| The Ukrainian legal translation is legally imprecise. | The "English version prevails" note (functional requirement). Owner review. |
| A lead is lost when Telegram is down or the token is wrong. | Return `502` so the visitor sees the localized error with the `mailto:` fallback (no silent success). Log `[contact] telegram failed: <status>` without personal data. Do a smoke test against the real chat right after deploy. |
| HTML injection or formatting breakage in the Telegram message from visitor input. | Escape `& < >` in every field before building the HTML. Enforce length caps in validation. Unit test with `<b>`/`&` input. |
| Bot token leak. | Server-only env var (no `NEXT_PUBLIC_`), never logged. Rotate via @BotFather if exposed. |
| Contact spam. | Honeypot field plus the per-IP rate limiter (in-memory per instance, the same caveat as chat). |
| Accept-Language detection makes the home page dynamic. | Only the middleware reads headers. The page itself stays static, and the redirect is edge-level. |

---

## 4. Testing Strategy

One test file per feature area, each covering several acceptance criteria together:

| File | Type | Covers |
|---|---|---|
| `src/i18n/i18n.test.ts` | Vitest | `en.json`/`uk.json` key parity. Legal `lastUpdated` parity across locales. `formatLegalDate('2026-10-15','uk')` → "15 жовтня 2026 р.". `buildPageMetadata` canonical, `languages` and `x-default`. `sitemap()` lists every route in both locales with alternates. Middleware detection: cookie uk/en, Accept-Language q-values, non-home path never redirected. |
| `src/server/chat/chat.test.ts` (extend) | Vitest | `parseChatRequest`: `locale` uk accepted, missing → en, invalid → rejected. uk prompt has the language rule, only `/uk` links, the same prices and the `HANDOFF_TOKEN`. Prompt memoised per locale. |
| `tests/e2e/i18n.spec.ts` | Playwright | Legacy EN URLs return 200 with no redirect. `/uk/services` renders in uk with `<html lang="uk">`, a uk `<title>` and an `hreflang` link pair. Switcher EN↔UA keeps the page (services, case study), lands at the top, and is a no-op on the active option. Keyboard Enter switches. Group label, endonyms and `aria-current` are present. Mobile switcher sits above Free Quote. First visit to `/` with `Accept-Language: uk` → `/uk`, with the cookie `en` → stays. Uk 404 for `/uk/nope`. All internal links on `/uk` pages start with `/uk`. Uk legal page shows the prevailing note and uk date. |
| `tests/e2e/chat.spec.ts` (extend) | Playwright, mocked `/api/chat` | On a uk page, the greeting and suggestions are in uk and the request body has `locale: 'uk'`. Handoff goes to `/uk#lets-talk`. An EN conversation survives a switch to UA, and the UI turns uk. |
| `src/server/contact/contact.test.ts` | Vitest | `parseContactRequest`: required, invalid and over-long fields; locale default and rejection. `formatLead`: "Language: Ukrainian" for uk and "Language: English" for en; HTML escaping; empty message shown as "—". The route with a mocked `fetch`: honeypot → 200 and no send; Telegram failure → 502; missing env → 503. |
| `tests/e2e/contact.spec.ts` | Playwright, mocked `/api/contact` | Uk empty-name validation, success and error messages, with the `mailto:` fallback on error. The payload carries `locale: 'uk'` from `/uk` pages and `'en'` from English pages. |
