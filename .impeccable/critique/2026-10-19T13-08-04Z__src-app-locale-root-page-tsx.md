---
target: home page
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\serg9\\Documents\\GitHub\\web41agency\\src\\app\\[locale]\\(root)\\page.tsx"
target_fingerprint: "sha256:3e2ab34127f849f40306a24f49659a59013b25494f65336fb15ae63f8e7783f5"
target_path: "C:\\Users\\serg9\\Documents\\GitHub\\web41agency\\src\\app\\[locale]\\(root)\\page.tsx"
timestamp: 2026-10-19T13-08-04Z
slug: src-app-locale-root-page-tsx
closed: true
---
Method: dual-agent (A: a783760dd0fce9e36 · B: a4354a8c31b9486cb)

## Design Health Score: 21/32 (66%, Acceptable)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Form states good; swiper has no position/count indicator |
| 2 | Match System / Real World | 2 | Insider labels: "JS Development", "Low Code", "low and pure code" |
| 3 | User Control and Freedom | 3 | Accordions/swiper reversible |
| 4 | Consistency and Standards | 2 | 5 CTA labels for one action; EN/UK label drift; Services vs FAQ rows differ; heading case mixed |
| 5 | Error Prevention | 3 | Labelled, required markers, email pattern |
| 6 | Recognition Rather Than Recall | 3 | Nav + sticky Free Quote visible |
| 7 | Flexibility and Efficiency | n/a | Single-visit persuade page |
| 8 | Aesthetic and Minimalist Design | 2 | 8.6k px desktop / 9.3-9.9k mobile; 8-card block in Services; lime as large areas |
| 9 | Error Recovery | 3 | Focus to first error + mailto fallback; invalid fields no visual state |
| 10 | Help and Documentation | n/a | FAQ covers it |

## Design Specificity Verdict
LLM: visual system is Web41's own (black/white/lime, lime disc, Fixel, real-project marquee); structure is stock agency template. None of speed / AI / small senior team reaches the first viewport; "3–7 days" first appears ~1,300px down; "3y combined experience" undercuts "senior"; About still pitches Webflow (messages/en.json About.details).
Deterministic: CLI page 0; src/components 13 advisory design-system-font-size (LetsTalk.tsx:175, PrivacyAndTerms.tsx:7/17, Logo.tsx:21 on home; rest case-study/legal). Overlay: / 4, /uk 5, /services 0, /portfolio 0, / mobile 1. oversized-h1 (mostly FP, DESIGN.md clamp; UK 49vh wrap real), low-contrast 2.8:1 step numerals howItWorksItem.tsx:23 (aria-hidden, partial FP), heading-rhythm x2 (FP, spacing on previous section), em-dash-overuse /uk 16 (real). No console errors, no real horizontal scroll at 390px.

## Priority Issues
- [P1] Hero + About miss positioning and undercut trust (generic H1 PageHero.tsx:67-77; "3y combined" stat; "13 shipped" counts concept projects; Webflow line; tab title "for Small Businesses"). → clarify, shape
- [P1] 5 CTA labels for #lets-talk (Free Quote / Free Consultation / Get a quote x6 / Send Message / Get a free quote →); UK uses "Безкоштовна оцінка" vs "консультація" for same buttons. Single label in Cta namespace. → clarify
- [P2] A11y gaps: no <main>/skip link (layout.tsx:126-131); hero alt "Slide N" (HeroAnimationItem.tsx:61); FAQ lacks aria-controls/inert; header CTA 40px, Privacy/Terms links 16px; no aria-invalid style. → harden
- [P2] Lime overuse: How it works CTA lime card ~628x351, two lime discs in About, 14 lime icon badges, header muddy over lime. → quieter
- [P2] IA/closing: Why Choose after FAQ (page.tsx:57-59); "What's included" reads landing-only, UK title implies price; AI-price promise while chat flagged off; no reassurance at form. → layout + distill

## Persona Red Flags
- Skeptical US B2B owner (from audit email): no "we rebuild outdated sites" on page; "Small Businesses" title; "3y" reads junior; "13 shipped" partly contradictable; no reply-time promise.
- Jordan: Low Code vs JS Development unclear; FAQ jargon; three CTA labels.
- Riley: tiny form errors, no field outline; swiper hides 13 count; AI-price line dead when chat off; collapsed FAQ answers reachable.
- Casey: 9.3k/9.9k px; What's included +~1,000px; marquee pushes About below fold.

## Minor Observations
- 8 public timelines carry TODO(owner): confirm (servicesContent.ts:43 etc.).
- UK H1 4 lines, orphaned dash. Lang pill "UA" vs DESIGN.md "UK". Mixed heading case/weight. FAQ rows vs Services hairlines. About circle bleeds (lg:-mb-40). "maintenance packages" claim unverified. UK 16 em-dashes. Off-ramp literal font sizes.

## Questions to Consider
- Your main visitor holds your audit; why does the page never say "we fix sites like yours"?
- Is "3 years combined" earning its lime circle, or is no stat stronger?
- What if the page were half as long and ended on one case + the form?
