# 01 — Env config for site URL and contact email

**Priority:** prerequisite for 02 and 08.

## Problem
`hello@web41.agency` is hardcoded in 5 places. `SITE_URL` already reads
`NEXT_PUBLIC_SITE_URL`, but the repo has no env file that documents the keys.

Hardcoded email locations:
- `src/app/layout.tsx` (JSON-LD `email`)
- `src/app/(root)/contacts/page.tsx`
- `src/components/letsTalk/LetsTalk.tsx` (×2 links + visible text)
- `src/components/layout/footer/footerComponents/SocialList.tsx`

## Steps
1. Create `.env.example` in the repo root (commit it; `.env*` files are gitignored
   but `.env.example` is not):
   ```
   # Public origin, no trailing slash. Example: https://web41agency.com
   NEXT_PUBLIC_SITE_URL=
   # Public contact email shown on the site and used in mailto links
   NEXT_PUBLIC_CONTACT_EMAIL=
   ```
2. Create `.env.local` with the same empty keys. It is gitignored. The owner fills it in.
3. In `src/utils/site.ts`, add:
   ```ts
   export const CONTACT_EMAIL =
     process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@web41.agency";
   ```
   Also make `SITE_URL` treat an empty string as unset. It uses `??` now, so
   `NEXT_PUBLIC_SITE_URL=` gives `""` and `new URL("")` breaks the build. Use `||`.
4. Replace every hardcoded email with `CONTACT_EMAIL` (`mailto:${CONTACT_EMAIL}`).
5. Add a short "Environment" section to `README.md` that lists both keys and says to set
   them in Vercel.

## Acceptance
- [x] `grep -r "hello@web41" src` finds only the fallback in `site.ts`
- [x] Build passes with empty env values and with filled ones
- [x] `.env.example` is committed. `.env.local` is not
