# Tasks: AI Pre-Sales Chat Assistant (004)

- **Functional Spec:** [functional-spec.md](./functional-spec.md)
- **Technical Spec:** [technical-considerations.md](./technical-considerations.md)
- **Decisions:** [decisions.md](./decisions.md)

Each slice leaves the app runnable. The kill switch `NEXT_PUBLIC_CHAT_ENABLED` stays `false` by default, so the site is unchanged until the owner enables it.

---

- [x] **Slice 1: Chat button and empty panel on every page**

  > Visitors see the accent chat button bottom-right, which opens and closes an empty panel. Behind the kill switch.

  - [x] Task: Add `NEXT_PUBLIC_CHAT_ENABLED=false` (with a comment) and the `OPENAI_API_KEY` / `OPENAI_MODEL` placeholders to `.env.example`, and list them for the Vercel project. **[Agent: vercel-infra]**
  - [x] Task: Create `src/consts/chat.ts` (import-free: `HANDOFF_TOKEN`, `CHAT_LIMITS`, `CHAT_STORAGE_KEYS`, `ChatErrorReason`) and `src/content/chatContent.ts` (`CHAT_COPY`, `CHAT_SUGGESTIONS`, `CHAT_GREETING`, `CHAT_NO_TEASER_PATHS`). **[Agent: nextjs-frontend]**
  - [x] Task: Add the `icon-chat`, `icon-refresh` and `icon-stop` symbols to `public/icons/sprite.svg`. **[Agent: nextjs-frontend]**
  - [x] Task: Build `src/components/chat/` launcher, panel shell, header, avatar and icon-button components (`ChatWidget`, `ChatLauncher`, `ChatPanel`, `ChatHeader`, `ChatAvatar`, `ChatIconButton`) with `index.ts` barrel. Open and close on click, the button changes to a cross, Escape closes it, focus returns to the launcher, and the cursor goes to the message box on open. Use motion values from the mobile menu, with reduced-motion off. **[Agent: nextjs-frontend]**
  - [x] Task: Add `ChatLoader.tsx` (client, `next/dynamic` with `ssr: false`, idle delay with a 2 s fallback) and mount it after `<Footer />` in `src/app/layout.tsx`, behind `NEXT_PUBLIC_CHAT_ENABLED === 'true'`. **[Agent: nextjs-frontend]**
  - [x] Task: Mirror `isOpen` from `src/components/layout/Header.tsx` to `document.documentElement.dataset.menuOpen` in a `useEffect` with cleanup, and hide the launcher with `[html[data-menu-open]_&]:hidden`. **[Agent: nextjs-frontend]**
  - [x] Verify: Run `npm run dev` in the background (record its PID), set `NEXT_PUBLIC_CHAT_ENABLED=true`, and drive with Playwright: the launcher is visible on `/`, the panel opens and closes, Escape returns focus, and the launcher is hidden when `html[data-menu-open]` is set. Stop the server by PID and delete any screenshots or recordings the check produced. **[Agent: playwright-qa]**

- [x] **Slice 2: Ask a question and read a streamed answer**

  > A visitor types a question, sees typing dots, and reads the answer word by word. Answers are built from the site's own content.

  - [x] Task: Add the `openai` dependency with `npm install openai`. **[Agent: nextjs-api-backend]**
  - [x] Task: Extract `src/content/caseStudyTitles.ts` (text-only `{ slug, title }[]`), make `caseStudiesContent.ts` import from it, and add `PRICING_TIERS` (`{ key, label, usd }`) to `src/content/pricing.ts`. Rename the "no-code sites" label in `whyChooseContent` to "Low Code". **[Agent: nextjs-frontend]**
  - [x] Task: Create `src/server/chat/config.ts` (`server-only`, `isChatEnabled()`, `getOpenAiConfig()`), `src/server/chat/validate.ts` (`parseChatRequest`, hand-written guards: 1–20 messages, last is `user`, non-empty, user ≤ 500 chars, assistant ≤ 4000, only `{ role, content }` kept) and `src/server/chat/systemPrompt.ts` (`buildSystemPrompt()`, memoised, static, no dates, eight ordered blocks from content via `.map()`, including the handoff rule). **[Agent: nextjs-api-backend]**
  - [x] Task: Create `src/server/chat/provider.ts` (the only file that imports `openai`; `streamChat({ messages, system, signal })` with `stream: true`, `max_completion_tokens: 600`, awaits the first delta before resolving, `cancel()` aborts upstream) and `src/app/api/chat/route.ts` (`runtime = 'nodejs'`, `dynamic = 'force-dynamic'`; order: enabled → validate → stream; 400 / 502 / 503 bodies as in §2.3; `X-Accel-Buffering: no`; passes `req.signal`). **[Agent: nextjs-api-backend]**
  - [x] Task: Write `src/components/chat/splitHandoff.ts` (pure, hides a trailing prefix of the token while streaming, flushes on final), `markdown.ts` and `ChatMarkdown.tsx` (bold, lists, links; `http(s)`, `mailto` and site-relative only; no `dangerouslySetInnerHTML`), and `types.ts`. **[Agent: nextjs-frontend]**
  - [x] Task: Write `src/components/chat/useChat.ts` (fetch with `AbortController` in a ref, `getReader()` + `TextDecoder({ stream: true })`, deltas flushed once per animation frame, status `idle | streaming | error | limited`, `isLong` derived) and the UI components `ChatMessageList`, `ChatMessage`, `ChatTyping`, `ChatComposer` (auto-grow to 4 lines, Enter sends, Shift+Enter newline, `sr-only` "Message" label, 16 px text) and `ChatSendButton`. **[Agent: nextjs-frontend]**
  - [x] Task: Write `src/server/chat/chat.test.ts` (Vitest, node) for `parseChatRequest` (empty, >20 messages, last not `user`, >500 chars), `buildSystemPrompt` (contains every `formatUsd(PRICING.*)` value and the contact email, no dates) and `splitHandoff` (token at end, token split across chunks, prefix hidden while streaming). Add `vitest` and the `test` script (`vitest run`). Write these tests first and confirm each fails before the code it covers is written (RED), then restore and confirm they pass. **[Agent: playwright-qa]**
  - [x] Verify: Run `npm run test` and the new `tests/e2e/chat.spec.ts` cases with `/api/chat` mocked by `page.route` (streamed body). Cover: send with Enter, typing dots, answer appears, Shift+Enter adds a newline, empty send does nothing. Then run `curl -N` against the dev route with a real key only if one is set locally, and otherwise skip that check and say so. Delete any screenshots or recordings produced during the check. **[Agent: playwright-qa]**

- [x] **Slice 3: Limits, errors, retry, long chat and Stop**

  > Limits and failures show the right message, and a visitor can retry or stop an answer.

  - [x] Task: Create `src/server/rate-limit/createRateLimiter.ts` (sliding-window log, `check(key)` async, prune and sweep at most once a minute, cap ~5000 keys) and `src/server/http/getClientIp.ts` (first `x-forwarded-for`, then `x-real-ip`, `net.isIP`, IPv6 bucketed by /64). Wire the `burst` (20 / 10 min) and `daily` (60 / rolling 24 h) rules into the route, returning 429 with `reason` and `Retry-After`. Record timestamps only for accepted requests. **[Agent: nextjs-api-backend]**
  - [x] Task: Handle 429 (`limited` state with `ChatLimitNotice`, which has the "Email us" `mailto:` link), network or non-200 errors (`ChatMessage` error variant with red outline and "Try again" resending the last user message without duplicating it), the long-chat note at 20 messages (`ChatLongNote` with "Start over" and "Get a free quote →" buttons, composer disabled), and Stop (`abort()`, keeps partial text, drops an empty assistant message, not an error). **[Agent: nextjs-frontend]**
  - [x] Task: Add `src/server/rate-limit/createRateLimiter.test.ts` (Vitest, fake timers): the 21st request in 10 min returns `burst`, the 61st in a day returns `daily`, and a rolling window reopens after expiry. Write first, confirm RED, then restore and confirm GREEN. **[Agent: playwright-qa]**
  - [x] Verify: Run the `tests/e2e/chat.spec.ts` cases for 429 (`limited` notice with email link), 502 (error bubble, Try again resends and gets an answer), the long-chat note at 20 messages with Start over restoring the composer, and Stop (text kept, send button returns). Delete any screenshots or recordings produced during the check. **[Agent: playwright-qa]**

- [x] **Slice 4: Handoff card to the Free Quote form**

  > Price, timeline and project-start answers end with a card that takes the visitor to the "Let's talk" form.

  - [x] Task: Extend `src/components/ui/Button.tsx` with `btnType: 'accent'` (`bg-accent text-black`), `size?: 'md' | 'sm'` (`sm` = h-11 px-5 text-base) and `onClick?`. Existing call sites stay unchanged. **[Agent: nextjs-frontend]**
  - [x] Task: Write `ChatHandoff.tsx` (black card, copy, accent "Get a free quote →" pill). On `/`, the handler calls `preventDefault`, scrolls `#lets-talk` into view (smooth unless reduced motion), runs `history.replaceState`, closes the panel without restoring focus to the launcher, and focuses the form. Off `/`, it uses `router.push('/#lets-talk')`. The `href` stays a real link for middle-click and no-JS. **[Agent: nextjs-frontend]**
  - [x] Verify: Run the `tests/e2e/chat.spec.ts` cases with a mocked `[[HANDOFF]]` answer: on `/` the chat closes and the page scrolls to `#lets-talk`; on `/portfolio` the browser lands on `/#lets-talk`; a general question (for example "What is UI/UX design?") shows no card. Also check that `[[HANDOFF]]` never appears on screen. Delete any screenshots or recordings produced during the check. **[Agent: playwright-qa]**

- [x] **Slice 5: Keep the conversation, teaser, suggestions and Start over**

  > The conversation survives page moves in the same tab. A teaser appears once per visit, and Start over clears the chat.

  - [x] Task: Add sessionStorage persistence to `useChat` (key `web41.chat.v1.messages`, `{ v: 1, messages }`, every read and write in try/catch, saved when an answer completes or stops, not per token; `limited` and `error` are not stored). Show the empty-state greeting and the three `ChatSuggestions` (hidden after the first send). Add "Start over" to the header (disabled when empty) that clears the stored conversation. **[Agent: nextjs-frontend]**
  - [x] Task: Write `ChatTeaser.tsx` (shows after 20 s once per tab session via `web41.chat.v1.teaserShown`, ✕ dismisses for the visit, clicking the text opens the panel, suppressed on `CHAT_NO_TEASER_PATHS`). **[Agent: nextjs-frontend]**
  - [x] Verify: Run the `tests/e2e/chat.spec.ts` cases for persistence across navigation (`/` → `/portfolio`), reopened panel keeps messages, a new tab shows only the greeting, Start over restores greeting and suggestions, suggestion click sends it, and the teaser appears after 20 s on `/` and not on `/privacy-policy`. Use fake timers or a shortened delay in the test. Delete any screenshots or recordings produced during the check. **[Agent: playwright-qa]**

- [x] **Slice 6: Mobile, keyboard, screen reader, reduced motion and print**

  > The chat works on a 375 px phone, with the keyboard, for screen readers, with reduced motion, and disappears when printed.

  - [x] Task: Add `useIsMobile.ts` (`matchMedia('(max-width: 1023px)')`), `useFocusTrap.ts` and `useVisualViewportHeight.ts` (sets `--chat-vh`). On mobile the panel is full screen with `aria-modal="true"`, body scroll locked, and a visible close button at the top. Desktop stays non-modal. **[Agent: nextjs-frontend]**
  - [x] Task: Add the accessibility details: the visible log is `role="log"` with `aria-live="off"`; a separate `sr-only` `role="status" aria-live="polite"` region gets the finished answer once, never on abort or per token; the launcher reads "Open chat" / "Close chat"; every clickable element is at least 44 × 44 px. Add `print:hidden` to the launcher, teaser and panel. Under reduced motion, remove the fade and rise and stop the typing dots. **[Agent: nextjs-frontend]**
  - [x] Verify: Run the `tests/e2e/chat.spec.ts` cases at a 375 px viewport: full-screen panel, no overlap with the header "Free Quote" button or the form fields (with the launcher on screen), keyboard open with Enter, Escape closes with focus on the launcher, `reducedMotion: 'reduce'` (no animation), and print media hides the widget. Delete any screenshots or recordings produced during the check. **[Agent: playwright-qa]**

- [x] **Slice 7: Privacy notice, analytics events and release checks**

  > The privacy policy names the chat and OpenAI. Analytics and the build pass, and no key leaks to the client.

  - [x] Task: Add a "Chat assistant" `LegalSection` to `src/content/legal/privacy.ts` after "Cookies and analytics" (OpenAI as provider, no conversations kept after the visit, no sensitive data). Add OpenAI to "Who we share data with" and mention chat under "What we collect". There is no "At a glance" block in the file; if spec 003 adds one first, update it there. **[Agent: nextjs-frontend]**
  - [x] Task: Extend the `AnalyticsEvent` union in `src/utils/analytics.ts` with `chat_open` and `chat_handoff_click`, and fire them from `ChatWidget` and `ChatHandoff`. **[Agent: nextjs-frontend]**
  - [x] Verify: Run `npm run lint`, `npm run tsc` and `npm run build`. Then confirm that `grep -ri openai .next/static` and `grep -r "sk-" .next/static` are empty, and that the widget does not render with `NEXT_PUBLIC_CHAT_ENABLED` unset. Report the actual output and delete any build artifacts the check created outside `.next`. **[Agent: vercel-infra]**

- [x] **Slice 8: Feature Testing & Regression**

  > Verifies the whole feature end-to-end against functional-spec.md, run after all implementation slices are complete.

  - [x] Read functional-spec.md acceptance criteria in full. Generate acceptance-level tests that verify the entire feature as a whole, not individual slices: Vitest for server logic, Playwright for user flows in `tests/e2e/chat.spec.ts`. Write tests with RED validation (must fail before implementation is confirmed done). Annotate each test with `@spec: 004-ai-chatbot` and `@regression` if suitable for long-term regression. **[Agent: playwright-qa]**
  - [x] Run all generated tests. All must pass. Fix any failures before proceeding. **[Agent: playwright-qa]**
