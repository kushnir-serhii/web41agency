# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, equal weight (confirmed by owner, 2026-10-16):

- **Owners and managers of established US B2B companies with outdated websites.** Many arrive from Web41's own outbound work: a cold email, often with a site audit PDF attached. They come in skeptical, checking whether this agency is real, competent and worth a reply.
- **Small businesses, startups and solo founders** (international, English-speaking) who need a website, landing page or web app and have no in-house developer. They arrive from search, referrals or shared links, comparing agencies on price, speed and past work.

Secondary: teams with an existing product that need a specific add-on (design, branding, API/AI integrations), and Ukrainian-speaking business owners, who get the full site, the AI assistant and the quote form in Ukrainian under `/uk`.

The job in both cases: judge quickly what Web41 builds, how fast, and whether the work is good enough to start a conversation.

## Product Purpose

web41agency.com is the agency's main sales channel. It turns a visitor into a qualified lead in one visit by showing services, timelines and past work, and by making the free quote ("Let's talk") easy to send. Success: a visitor understands what Web41 builds and how long it takes, then sends a request or starts a chat that leads to one.

## Positioning

Confirmed by owner as Web41's real edge:

- **Speed.** Sites ship in days, not weeks.
- **Hands-on AI experience.** The team has shipped AI-powered products end to end (movie matching, forecasting dashboard, AI chat companion, investor matching). It works with any AI API (OpenAI, Anthropic, Google and others), not one vendor.
- **Small senior team.** Agency-grade output without agency overhead. The team's country of origin is not a public message: do not write "from Ukraine" or similar in site copy (owner decision, 2026-10-16).

Headline message direction (owner, 2026-10-16): balance hard skills (engineering, AI, speed) with soft skills (listening, understanding the client's business), plus a modern point of view on design. Not a Webflow pitch.

Prices are not a public differentiator: the site pages do not show prices (owner decision, 2026-10-16). Only the AI chat assistant tells visitors prices.

## Operating Context

- Outbound loop: Web41 finds outdated US B2B sites, scores them, sends an audit PDF and a cold email; the site is where the prospect checks the sender.
- Inbound: search, referrals and shared links, mainly to the home page, Services and Portfolio.
- Visitors compare against other agencies and freelancers, usually on desktop at work for B2B and on any device for founders.
- Leads arrive through the "Let's talk" form (delivered to the agency's Telegram chat) or the AI pre-sales chat, which hands qualified visitors to the form.

## Capabilities and Constraints

- **Services (six):** Landing Page, JS Development, Low Code / Webflow, API Integrations, UI/UX Design, Branding. Each has a description and timeline.
- **Pricing:** never shown on site pages; only the AI chat assistant quotes prices (owner decision, 2026-10-16). Single source stays `src/content/pricing.ts` (USD), feeding the chat prompt. Landing from $100 is confirmed; Low Code $800 and Custom $1,600 are still `TODO(owner): confirm`.- **Pages:** home (hero, services, how it works, portfolio preview, tech stack, FAQ, Let's talk), Services, Portfolio with case-study pages, Contacts, Privacy Policy, Terms of Use, 404.
- **AI pre-sales assistant** on every page; the only place prices are given. Answers services/prices/process/timeline questions and hands off to the form. Lead capture inside chat is a later phase.
- **Languages:** English (unprefixed) and Ukrainian (`/uk`), via next-intl. Every UI string and content module exists in both; new copy must too.
- **Stack:** Next.js 15 App Router, React 19, Tailwind 4, motion, swiper, self-hosted Fixel Display font, hosted on Vercel. Content lives in typed modules in `src/content/*`.
- **Out of scope:** blog, client accounts/portal, on-site payments or booking, CRM/admin.
- **No physical address.** Web41 has none; never show or invent one (remove the Address row from Contacts).
- **TODO(owner):** messenger and other contact links, added later (Contacts shows "coming soon" until then).
- **TODO(owner):** final Low Code and Custom prices (chat only).

## Brand Commitments

- Name: **Web41** / Web41 Agency; logo and favicon already in use (`public/favicon.png`, header logo).
- Voice in current copy: plain, direct, client-benefit first; short sentences; no agency jargon. Promise pattern: "an approach, a timeline and a price before you commit to anything."
- Bilingual EN/UK is a standing commitment, not a feature flag.

## Evidence on Hand

- **Portfolio:** 13 projects with images in `public/images/projects/` and case studies in `src/content/caseStudiesContent.ts`. The set is a **mix of paying-client work and own/concept projects** (owner-confirmed). Present them all simply as projects Web41 built: no Client / Own product labels or split on cards (owner decision, 2026-10-16). Still do not claim client engagements or client results for any project.
- **Portfolio cards:** industry and summary lines rewritten from each case study (2026-10-16). Card `metric` chips stay empty until a number is measured.
- **Metrics:** no project has a measured result yet. Never invent conversion lifts, traffic numbers or revenue figures.
- **Stats on About:** project count is derived from the case-study list; "3y combined experience" and "10+ industries" are owner-provided copy.
- **Absent, do not fabricate:** client testimonials, client logos, press, awards, reviews, team photos/bios, physical address (there is none).

## Product Principles

1. **Answer the buyer's questions fast:** what you build, how long, and what the work looks like. Price is a conversation: the AI chat answers it, pages never print it.
2. **Earn trust with truth.** Real work, honestly labelled; no invented clients, numbers or testimonials. The skeptical outreach visitor is the bar.
3. **The site is proof of the craft.** It must be as fast, modern and polished as what Web41 sells; a slow or generic page undercuts the pitch.
4. **Every path ends at a conversation.** CTAs, the chat and case studies all lead to the free quote.
5. **Both languages are first-class.** Ukrainian is never a partial translation.

## Accessibility & Inclusion

WCAG 2.1 AA is the target (spec `context/spec/001-design-critique-fixes/09-accessibility.md`): labelled form fields, ≥4.5:1 text contrast, visible `:focus-visible` styles, 44px touch targets, decorative icons hidden from screen readers, correct `lang` per locale.
