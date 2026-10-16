# 002 — Contact form backend

Source: follow-up to 001. `LetsTalk.tsx` `handleSubmit` only calls `console.log(form)`,
so every lead typed into the form is lost. `mailto:` links are the only working path today.

## Decisions needed from the owner (before starting)
1. **Email provider:** Resend (recommended: simple API, free tier, works from a Next.js
   route handler) vs. Postmark / SendGrid.
2. **Where leads go:** inbox only (`CONTACT_EMAIL`), or also stored in a DB (Neon is
   available) so nothing is lost if delivery fails.
3. **Sending domain:** a verified domain for the `from` address (DNS records required).

## Steps
1. Add env keys to `.env.example` and README (server-only, no `NEXT_PUBLIC_` prefix):
   `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. Set them in Vercel.
2. Create `src/app/api/contact/route.ts` (POST):
   - Parse JSON; validate `name` (1–100 chars), `email` (valid format), `message`
     (max 5000 chars) on the server. Never trust the client checks.
   - Spam protection: a hidden honeypot field plus basic rate limiting per IP.
   - Send the email via the provider. Set `replyTo` to the visitor's email.
   - Respond `200 { ok: true }`, `400` on validation errors, `500` on provider failure.
     Do not leak provider errors to the client.
3. In `LetsTalk.tsx`, replace the `console.log` with a `fetch('/api/contact')` call:
   - States: idle, sending (button disabled with "Sending…"), success, error.
   - Success: replace the form with a confirmation message (announce with
     `role="status"`), clear the fields.
   - Error: show an inline `role="alert"` message that includes the `mailto:` fallback.
   - Add the hidden honeypot input (`tabIndex={-1}`, `aria-hidden`, `autoComplete="off"`).
4. Remove the `console.log` TODO, which also clears the `no-console` lint warning.

## Acceptance
- [ ] Submitting a valid form delivers an email to `CONTACT_TO_EMAIL` with reply-to set
- [ ] Invalid input returns 400 and shows an error. Empty name/email never reaches the provider
- [ ] Filling the honeypot silently succeeds without sending
- [ ] Provider failure shows the error state with the mailto fallback
- [ ] No secrets in client bundle (`grep -r RESEND .next/static` is empty)
- [ ] `npm run lint`, `npm run tsc` and `npm run build` pass
