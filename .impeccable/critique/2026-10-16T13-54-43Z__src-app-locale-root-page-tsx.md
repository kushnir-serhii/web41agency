---
target: home page
total_score: 24
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 3
target_identity: "file:C:\\Users\\serg9\\Documents\\GitHub\\web41agency\\src\\app\\[locale]\\(root)\\page.tsx"
target_fingerprint: "sha256:3e2ab34127f849f40306a24f49659a59013b25494f65336fb15ae63f8e7783f5"
target_path: "C:\\Users\\serg9\\Documents\\GitHub\\web41agency\\src\\app\\[locale]\\(root)\\page.tsx"
timestamp: 2026-10-16T13-54-43Z
slug: src-app-locale-root-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score: 24/36 (67%, Acceptable)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Portfolio carousel has no position indicator (1 of 13) |
| 2 | Match System / Real World | 2 | "Low Code", "pure code", "JS Development" are insider terms; "13 successful projects" implies client outcomes |
| 3 | User Control and Freedom | 3 | Accordions/carousel reversible |
| 4 | Consistency and Standards | 2 | Four CTA labels for one action (Free Quote / Free Consultation / Get a quote / Send Message); speed claims contradict (3–7 days vs 2–4 weeks) |
| 5 | Error Prevention | 3 | Labelled fields, required marker |
| 6 | Recognition Rather Than Recall | 3 | Comparing service timelines needs opening 6 accordion rows |
| 7 | Flexibility and Efficiency | n/a | Single-pass persuasion page |
| 8 | Aesthetic and Minimalist Design | 2 | About stats, What's included (8 cards) and Why Choose Us repeat claims; 8.6k px desktop / 11k px mobile |
| 9 | Error Recovery | 3 | Form structure sound (not stress-tested) |
| 10 | Help and Documentation | 3 | FAQ present; chat (intended help + price channel) off in this build |

## Design Specificity Verdict
LLM: category-interchangeable agency template. Section order is stock agency theme. None of the three confirmed edges (speed, any-AI-API experience, small Ukrainian team) reaches a headline. Copy sells Webflow; portfolio proves AI products. Lime #DEFF00 + black + Fixel is distinctive but applied identically everywhere (lime icon circles x3 sections, lime blobs); hero lime blob cuts through subcopy (PageHero.tsx:47-72).
Deterministic: CLI detect 0 findings (regex-only on .tsx; undercount). Browser overlay: / 12, /services 8, /portfolio 1, /uk 12. icon-tile-stack x8 (Services "What's included"), oversized-h1 (88px, 37vh EN / 61vh UK), low-contrast 2.8:1 on How it works step numbers (howItWorksItem.tsx), skipped-heading h1→h3 on /portfolio, heading-rhythm x2 (likely false positive: spacing lives on section padding). No console errors, no horizontal overflow at 390px.

## Priority Issues
- [P0] Prices printed on home page (Why Choose Us "Cost-Effective": $100/$800/$1,600; whyChooseContent.ts pricingSegments, EN+UK). Violates owner decision; $800/$1,600 unconfirmed. Fix: remove price segments; replace with "fixed quote after a free call" / ask the AI assistant. → clarify
- [P1] Hero + positioning generic, miss speed/AI/Ukraine team; speed contradiction (whyChooseContent.ts:61,105; faqContent.ts:44,84 "2–4 weeks"). → clarify + typeset/bolder on hero
- [P1] Mobile hero gallery broken: HeroAnimation.tsx:17 `h-[500px] px-20` at all widths → ~50px thumbnails at 390px. → adapt
- [P1] "13 successful projects" overclaims on mixed client/own portfolio; cards unlabelled. → clarify
- [P2] CTA sprawl (4 labels) and no reassurance at form (who replies, how fast, no obligation, what you get); UK secondary hero CTA clipped at 1440. → clarify, layout

## Persona Red Flags
- Skeptical US B2B owner (cold email): no audit/redesign offer, no team/location, portfolio barely shows B2B corporate work, "$100" reads cheap, bubble stats read as filler.
- Jordan: opaque service names, 6 services + 8 inclusions + 13 projects with no "start here".
- Riley: contradictory speed claims; "Free hosting" static-only; no price path once prices go if chat flag is off.
- Casey: broken hero gallery; lime blobs overlapping header and "Landing Page" label; 11k px with form at bottom, no sticky CTA.

## Minor Observations
Grey/black/grey H1 mutes strongest words; FAQ questions louder than answers; How it works step titles misaligned; footer wordmark oversized; TechStack commented-out dead code (page.tsx:11,50); long SEO-ish portfolio titles; low-contrast step numbers; skipped heading on /portfolio.

## Questions to Consider
1. Should a cold-email prospect's first read be about their outdated site (audit → redesign in days)?
2. Best proof is shipped AI products, copy sells Webflow: which agency do you want to be hired as?
3. With no prices, testimonials or metrics, what becomes the evidence: a visible team, labelled case studies with real timelines, the AI chat itself?
