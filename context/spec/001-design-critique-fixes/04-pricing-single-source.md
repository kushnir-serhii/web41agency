# 04 — One source of truth for prices

**Priority:** 🔴 critical. The prices on the page contradict each other.

## Problem
- `src/content/servicesContent.ts`: every service says "From $120".
- `src/content/whyChooseContent.ts`: says no-code "from 800USD" and custom "from 1600USD".
The copy uses two currency formats ($120 vs 800USD).

## Owner decision
A simple landing page starts **from $100**. The other prices are not confirmed yet.

## Steps
1. Create `src/content/pricing.ts`:
   ```ts
   export const PRICING = {
     landing: 100,       // confirmed by the owner
     lowCode: 800,       // TODO(owner): confirm. Taken from the current Why Choose Us copy
     custom: 1600,       // TODO(owner): confirm. Taken from the current Why Choose Us copy
     apiIntegrations: 1600, // TODO(owner): confirm
     uiUxDesign: 800,       // TODO(owner): confirm
     branding: 800,         // TODO(owner): confirm
   } as const;
   export const formatPrice = (usd: number) => `From $${usd.toLocaleString("en-US")}`;
   ```
   Use one format everywhere: `From $1,600`.
2. `servicesContent.ts`: build each `price` from `PRICING`. Services map:
   JS Development → `custom`, Low Code → `lowCode`, API Integrations →
   `apiIntegrations`, UI/UX Design → `uiUxDesign`, Branding → `branding`.
   Add a service **"Landing Page"** as the first item, priced at `PRICING.landing`,
   timeline "3–7 days". Description: "A focused one-page site that turns visitors into
   leads — fast to launch, easy to update." Also give each service a realistic timeline in place of the
   shared placeholder "1–3 weeks" (TODO(owner) where unsure).
3. `whyChooseContent.ts` "Cost-Effective": rewrite it to use `PRICING` values,
   e.g. "landing pages from **$100**, no-code sites from **$800** and custom-built
   applications from **$1,600**." Keep the `highlight` structure.
   Also remove the stray `,` (empty array hole) at the end of `mainContent`.
4. `grep -rn "\$[0-9]\|USD" src/content` must only match `pricing.ts`.

## Acceptance
- [x] Every price on the site comes from `pricing.ts`
- [x] Services and Why Choose Us show the same numbers in the same format
- [ ] The TODO(owner) markers are listed in the PR description
