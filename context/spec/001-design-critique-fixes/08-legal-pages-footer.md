# 08 — Privacy Policy, Terms of Use, footer fixes

**Priority:** 🔴 critical. The form asks visitors to agree to pages that do not exist, which return 404.
**Depends on:** 01 (`CONTACT_EMAIL`, `SITE_URL`, `SITE_NAME`).

## Problem
- `src/components/layout/footer/footerComponents/PrivacyAndTerms.tsx`: "Privacy Policy" and
  "Terms of Use" are plain `<p>` text, not links. The copyright reads
  "Web41 All rights reserved2025" (missing space, and a hardcoded, outdated year).
- `src/components/letsTalk/LetsTalk.tsx`: "By filling out the form I agree to Privacy
  Policy and Terms of Use" has no links.
- `/privacy-policy` and `/terms-of-use` return 404.

## Steps
1. Create `src/app/(root)/privacy-policy/page.tsx` and `src/app/(root)/terms-of-use/page.tsx`.
   - Simple text layout (`container`, `max-w-[760px]`, `h1`/`h2`/`p`/`ul`), with no PageHero
     animation. Put the text in `src/content/legal/privacy.ts` and `src/content/legal/terms.ts`
     as section arrays, so the owner can edit it without touching JSX.
   - Add a "Last updated: <date>" line.
   - Metadata: title, description, canonical. `robots: { index: true, follow: true }`.
2. **Draft generic content.** Put this at the top of each content file:
   `// TODO(legal): generic template — review before relying on it`. Read the company name,
   email and site URL from `site.ts`. Do not hardcode them.
   - Privacy: what we collect (name, email and message from the contact form; basic
     analytics if any; check the repo, and list only what is actually used), why we collect it, legal basis
     (GDPR consent/legitimate interest), how long we keep it, third parties (hosting: Vercel),
     user rights (access/delete), contact email, and changes.
   - Terms: use of the site, intellectual property, the fact that the portfolio shows client
     work with permission, no warranty, limitation of liability, external links, governing law
     (`TODO(owner): jurisdiction`), contact, and changes.
3. Footer `PrivacyAndTerms.tsx`: use `<Link>` to both pages. Copyright:
   `© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.`
4. LetsTalk consent text: link both names with `underline` and keep the text readable.
5. Add both routes to `src/app/sitemap.ts` (priority 0.2, changeFrequency "yearly").

## Acceptance
- [x] `/privacy-policy` and `/terms-of-use` return 200 with real content
- [x] The footer and form links go to them
- [x] The footer shows the current year (2026), and the spacing is correct
- [x] No hardcoded email or domain in the legal content
