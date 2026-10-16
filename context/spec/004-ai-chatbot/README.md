# 004 — AI chat assistant

**Priority:** 🟡 medium. **Goal:** answer visitor questions about services, pricing, process and
timelines on any page, and move qualified visitors to the "Free Quote" form (`#lets-talk`).
It is a pre-sales assistant, not a general chatbot.

**Stack:** the bot runs on the **OpenAI API** (`openai` npm SDK). The implementation is done with
**Claude Sonnet** (`claude-sonnet-5-5`) in Claude Code.

## Decisions needed from the owner (before starting)
1. **OpenAI model.** Pick a current small, fast chat model in the OpenAI console. A mini/fast tier is
   enough for short pre-sales answers and keeps cost low. It is set through `OPENAI_MODEL`, so it can be
   changed without a code change. Only `src/server/chat/provider.ts` knows about OpenAI.
2. **Lead capture in chat.** Phase 1 (this spec): the bot hands off to the `#lets-talk` form.
   Phase 2 (after spec 002 ships): the bot collects name and email and posts to `/api/contact`.
3. **Budget guardrails.** Monthly spend cap (usage limit) set in the OpenAI console, plus the per-IP limit in step 2.
4. **Greeting.** Should the launcher show a one-time teaser bubble after 20 s? (Recommended: yes, once per
   session, never on `/privacy-policy` or `/terms-of-use`.)

## Design direction (product design rationale)

The site's voice is bold and minimal: Fixel Display, black and white, one loud accent (`#DBFF04`),
soft `bg_item` (#f9f9f9) surfaces, pill shapes and a frosted-glass header. The chat must look like
part of the site, not a third-party widget (Intercom/Drift look is what we avoid).

1. **One accent moment.** The launcher is the only accent-filled element on screen. It reuses the
   80px accent circle from `LetsTalk` (the send button), so visitors already know it as "talk to us".
2. **Same surfaces as the site.** The panel header uses the same glass as the site header
   (`bg-bg_header/30 backdrop-blur-[100px]`). Bot messages sit on `bg_item`. Visitor messages are
   black with white text, matching the primary `Button`.
3. **Pills everywhere you click.** Suggested questions, the input and the send button are all
   `rounded-full`, like the nav and CTAs.
4. **Conversion is the point.** Every answer that touches price or scope ends with a handoff card:
   a black card with an accent "Get a free quote" pill linking to `#lets-talk`.
5. **Quiet motion.** Use `motion` (already installed): a 200 ms fade and 8 px rise, the same values
   as the mobile menu in `Header.tsx`. Turn everything off under `prefers-reduced-motion`.
6. **Honest AI.** Label it "AI assistant", say it can be wrong, and always offer a human
   (`mailto:${CONTACT_EMAIL}`).

### Tokens (add to `@theme inline` in `globals.css`)
| Token | Value | Use |
|---|---|---|
| existing `accent` | #DBFF04 | launcher, send button, handoff CTA, unread dot |
| existing `bg_item` | #f9f9f9 | bot bubble, suggestion chips hover |
| existing `bg_header` | #ededed | panel header glass (`/30`) |
| existing `muted_text` | #656973 | timestamps, disclaimer, placeholder |
| new `--shadow-chat` | `0 24px 64px -12px rgb(0 0 0 / 0.25)` | panel elevation |

No new colors. Body text in chat is `text-base` (16px) to prevent iOS zoom on the input.

## Layout

```
Desktop (lg+): floating panel, bottom-right, 24px from edges
                                   ┌──────────────────────────────────┐
                                   │ (●) Web41 assistant      [—] [✕] │ glass header, h-16
                                   │     AI · usually replies in secs  │ muted_text 13px
                                   ├──────────────────────────────────┤
                                   │ ┌ bot (bg_item, rounded-3xl,    ┐ │
                                   │ │ rounded-bl-md) Hi! I can help │ │
                                   │ │ with services, pricing…       │ │
                                   │ └───────────────────────────────┘ │
                                   │ ( How much is a landing page? )  │ suggestion pills
                                   │ ( How long does a site take?  )  │ border-black/10
                                   │ ( Webflow or custom code?     )  │
                                   │        ┌ user (bg-black,       ┐ │
                                   │        │ text-white,           │ │
                                   │        │ rounded-br-md) …      │ │
                                   │        └───────────────────────┘ │
                                   │ ● ● ●  (typing, bg_item pill)    │
                                   │ ┌ Handoff card (bg-black) ─────┐ │
                                   │ │ Want an exact quote?          │ │
                                   │ │ [ Get a free quote → ] accent │ │
                                   │ └───────────────────────────────┘ │
                                   ├──────────────────────────────────┤
                                   │ ( Ask about your project…   (➤)) │ pill input h-14,
                                   │ AI can make mistakes · Email us  │ accent send circle
                                   └──────────────────────────────────┘
                                   w-[400px] h-[min(640px,calc(100dvh-120px))]
                                   rounded-[32px] bg-white shadow-chat
                                                                   (✕) ← launcher 64px
Mobile (<lg): launcher 56px, bottom-4 right-4. The panel opens as a full-screen sheet
(inset-0, h-dvh, no radius), covering the header. Header gets a back/close button (44px).
The input stays pinned above the keyboard (`pb-[env(safe-area-inset-bottom)]`).
```

### Component styles
- **Launcher:** `fixed bottom-6 right-6 z-[90] size-16 rounded-full bg-accent text-black shadow-chat
  transition-transform hover:scale-105 active:scale-95`, chat-bubble icon 28px. Open state shows a cross
  (same `icon-cross` as the mobile menu). Optional unread dot: `size-3 rounded-full bg-black ring-2 ring-accent`.
  Hide it while the mobile menu is open, and on print (`print:hidden`). Keep it clear of the
  `LetsTalk` form: no overlap at 375 px.
- **Teaser bubble:** `bg-white rounded-3xl rounded-br-md shadow-chat px-5 py-3 text-base`, above the launcher,
  with a dismiss `✕`. "Questions about your website? Ask me." Shown once per session (`sessionStorage`).
- **Panel:** `bg-white rounded-[32px] shadow-chat overflow-hidden flex flex-col`, `z-[110]` (above the
  header's `z-100`).
- **Header:** avatar = 40px black circle with an accent "41" monogram (Fixel bold 14px); title `text-lg font-bold`;
  subtitle `text-[13px] text-muted_text`. Icon buttons `size-11 rounded-full hover:bg-black/5`.
- **Bubbles:** `max-w-[85%] px-4 py-3 text-base leading-relaxed`. Bot: `bg-bg_item text-black rounded-3xl
  rounded-bl-md`. User: `bg-black text-white rounded-3xl rounded-br-md ml-auto`. 8px gap within a group,
  16px between speakers. Render bot markdown for **bold**, lists and links only (links underlined,
  internal ones use `next/link`).
- **Suggestion pills:** `h-11 px-4 rounded-full border border-black/10 text-sm font-medium hover:bg-bg_item`.
  Shown only before the first message. Content lives in `src/content/chatContent.ts`.
- **Typing indicator:** three 6px black/40 dots in a `bg_item` pill, staggered opacity pulse. Static under reduced motion.
- **Handoff card:** `bg-black text-white rounded-3xl p-5`, line of copy, then an accent pill
  `bg-accent text-black h-11 px-5 rounded-full font-bold` linking to `CONSULTATION_HREF`. Clicking it closes the panel
  so the form is visible.
- **Composer:** `h-14 rounded-full bg-bg_item pl-5 pr-1.5` with a borderless input and a `size-11 rounded-full
  bg-accent` send button (`icon-send`, disabled = `opacity-40`). Enter sends, Shift+Enter is a newline (auto-grow up
  to 4 lines, then the radius drops to `rounded-3xl`). Counter appears at 400+ of 500 chars.
- **Footer line:** `text-xs text-muted_text`: "AI can make mistakes. Prefer a human? Email us" (mailto link).
- **Error state:** bot-style bubble with a `border border-red-600/20` and a "Try again" text button.
  Rate-limited: "You've hit the message limit. Email us at …".

## Implementation steps

### 1. Config & dependencies
- `npm i openai` (server only, never imported from a client component).
- Add to `.env.example` (no `NEXT_PUBLIC_` prefix): `OPENAI_API_KEY=`, `OPENAI_MODEL=` (model chosen in decision 1).
  Add `NEXT_PUBLIC_CHAT_ENABLED=true` as a kill switch. Set them in Vercel.

### 2. Server — `src/app/api/chat/route.ts` (POST, `runtime = 'nodejs'`)
- Body: `{ messages: { role: 'user' | 'assistant', content: string }[] }`. Validate on the server: 1–20 messages,
  last one from `user`, each max 500 chars (user) / 4000 (assistant). Return `400` otherwise.
- Rate limit per IP: 20 messages / 10 min, 60 / day (in-memory `Map` is fine to start; note that it resets per
  serverless instance, move to Upstash or Neon later if abused). Return `429` with a JSON reason.
- `src/server/chat/provider.ts` wraps the SDK: `streamChat(messages, system)` returns a `ReadableStream<string>`
  of text deltas, using `client.chat.completions.create({ model: OPENAI_MODEL, stream: true, max_completion_tokens: 600, messages: [{ role: 'system', content: system }, ...messages] })`. Read `chunk.choices[0]?.delta?.content`.
  This is the only file that knows about the provider.
- `src/server/chat/systemPrompt.ts` builds the system prompt **from the existing content files**, so answers never
  drift from the site: `servicesContent`, `PRICING` + `formatUsd`, `faqContent`, `howItWorksContent`,
  `caseStudiesContent` titles, `CONTACT_EMAIL`, `SITE_URL`. Rules in the prompt:
  - Only talk about Web41 Agency, its services and web projects; politely decline everything else.
  - Quote prices only as "from $X" using `PRICING`; never invent prices, dates or guarantees.
  - Short answers (≤ 120 words), plain English, mirror the visitor's language.
  - When the visitor asks about price, timeline or starting a project, end with the token `[[HANDOFF]]`.
    The client strips it and renders the handoff card.
  - Never ask for or repeat sensitive data (passwords, card numbers).
  - Keep the system prompt static and always first. OpenAI caches long identical prefixes automatically, which cuts cost and latency. Do not put dates or per-visitor data in it.
- Respond with `new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })`.
  On provider errors, log server-side and return `502 { error: 'unavailable' }`. Never forward provider messages.
- Abort the provider call when the client disconnects (`req.signal`).

### 3. Client — `src/components/chat/`
- `ChatWidget.tsx` (`'use client'`): owns `isOpen`, `messages`, `status: 'idle' | 'streaming' | 'error' | 'limited'`.
  Persist messages in `sessionStorage` (wrapped in try/catch) so a page navigation does not wipe the chat.
- `ChatLauncher.tsx`, `ChatPanel.tsx`, `ChatMessage.tsx`, `ChatComposer.tsx`, `ChatHandoff.tsx`, `ChatTeaser.tsx`.
- Streaming: `fetch('/api/chat', { signal })`, read `res.body.getReader()`, append deltas to the last assistant
  message. A "Stop" state on the send button aborts the request.
- Mount in `src/app/layout.tsx` after `<Footer />` with `next/dynamic(() => import(...), { ssr: false })`
  so it adds nothing to first load (this branch is SEO work: LCP must not regress). Render nothing when
  `NEXT_PUBLIC_CHAT_ENABLED !== 'true'`.
- Reuse `cn`, `Icon` (`icon-send`, `icon-cross`; add a chat icon to the sprite), `CONSULTATION_HREF`, `CONTACT_EMAIL`.

### 4. Accessibility
- Launcher: `aria-label="Open chat"` / `"Close chat"`, `aria-expanded`, `aria-controls="chat-panel"`.
- Panel: `role="dialog" aria-modal="false" aria-labelledby` (modal on mobile, where it is full screen).
  Focus moves to the input on open and back to the launcher on close. `Esc` closes.
- Message list: `role="log" aria-live="polite"`. Announce only the finished assistant message, not every token.
- Input has a visible-to-screen-readers label "Message". All targets ≥ 44px. Contrast: black on accent is 17:1.

### 5. Legal & content
- Privacy Policy (spec 003): add a "Chat assistant" section. Messages are processed by OpenAI to generate
  replies (under OpenAI's API data policy, which the owner should confirm and link), and not stored by us beyond the browser session.
  Update the "At a glance" point "We only collect what you send us through the form or email" to include chat.
- Add the disclaimer line in the panel footer (above).

## Out of scope (phase 2)
Lead capture inside chat (needs 002), storing transcripts in Neon, an admin view, multiple languages in the UI.

## Acceptance
- [ ] The launcher appears on every page bottom-right, opens the panel, and does not cover the header CTA or form fields at 375 px
- [ ] Answers stream token by token. Prices in answers match `pricing.ts` exactly
- [ ] Off-topic questions (e.g. "write me a poem") are politely declined
- [ ] Pricing/timeline questions show the handoff card. Clicking it closes the panel and scrolls to `#lets-talk`
- [ ] Message 21 in 10 minutes from one IP gets the limit state. Invalid bodies return 400
- [ ] Provider down → error bubble with "Try again" and the email fallback
- [ ] Keyboard only: open, type, send, close with Esc, focus returns to the launcher. Screen reader announces replies
- [ ] Reduced motion: no animations. Print: no chat UI
- [ ] `OPENAI_API_KEY` is not in the client bundle (`grep -ri openai .next/static` is empty)
- [ ] Lighthouse mobile performance on `/` does not drop versus `main`
- [ ] `npm run lint`, `npm run tsc` and `npm run build` pass
