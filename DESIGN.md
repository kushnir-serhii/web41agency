---
name: Web41 Agency
description: Black-and-white confidence with one lime signal that says "look here, act here."
colors:
  signal-lime: "#dbff04"
  ink-black: "#000000"
  paper-white: "#ffffff"
  graphite: "#333333"
  slate-mute: "#656973"
  mist-grey: "#f9f9f9"
  frost-grey: "#ededed"
  placeholder-grey: "#6b6b6b"
typography:
  display:
    fontFamily: "Fixel Display, Arial, Helvetica, sans-serif"
    fontSize: "clamp(60px, 6.1vw, 88px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  headline:
    fontFamily: "Fixel Display, Arial, Helvetica, sans-serif"
    fontSize: "clamp(36px, 4.2vw, 60px)"
    fontWeight: 600
    lineHeight: 1.1
  title:
    fontFamily: "Fixel Display, Arial, Helvetica, sans-serif"
    fontSize: "clamp(24px, 2.2vw, 32px)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Fixel Display, Arial, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Fixel Display, Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Fixel Display, Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    letterSpacing: "0.025em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  pill: "100px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "56px"
  button-primary-small:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
    height: "44px"
  button-accent:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "56px"
  button-ghost:
    textColor: "{colors.ink-black}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "56px"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.xs}"
    padding: "18px 24px"
    height: "64px"
  card:
    backgroundColor: "{colors.mist-grey}"
    rounded: "{rounded.sm}"
    padding: "32px"
  chip:
    textColor: "{colors.ink-black}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  icon-badge:
    backgroundColor: "{colors.signal-lime}"
    rounded: "{rounded.full}"
    size: "80px"
  nav-bar:
    backgroundColor: "{colors.frost-grey}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.pill}"
    padding: "8px 8px 8px 16px"
  language-pill-active:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "36px"
  chat-launcher:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.full}"
    size: "56px"
  chat-bubble-bot:
    backgroundColor: "{colors.mist-grey}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  chat-bubble-user:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
---

# Design System: Web41 Agency

## Overview

**Creative North Star: "The Signal in the Room"**

The site is a white room with black type and one lime signal. Everything structural is monochrome: ink-black headlines, white space, pale grey panels. One color, Signal Lime, marks where to look or what to do: the drifting hero circle, the active language, an open accordion row, the step badge, the chat launcher. The visitor is usually a skeptical buyer checking whether Web41 is real, and the restraint does the persuading: big bold type, short copy and real project imagery, with nothing decorative between them and the next step.

The mood is confident, airy and direct. Density is low. Headlines run large (60–88px display, 36–60px section heads), body copy sits at 18px at 80% opacity, and sections breathe with 80px gutters on desktop. Motion is slow and physical, never flashy: the lime circle rises in and drifts with scroll on a soft spring, project covers zoom 5% on hover, accordions open on a 300ms grid-row transition, and every effect yields to `prefers-reduced-motion`.

Components are confident and tactile: 56px pill buttons in bold type that lift 2px on hover and press to 98% on click; flat grey cards with 8px corners; full-width accordion rows split by hairline dividers. The site is also the sales proof, so the system has to hold up next to whatever it sells.

**Key Characteristics:**
- Monochrome structure (black, white, two greys) with a single lime accent.
- One typeface, Fixel Display, in four weights; hierarchy comes from size and weight, not from mixing families.
- Pills and circles for anything interactive or signalling; 8px corners for content containers.
- Flat surfaces; depth comes from tone (#f9f9f9 panels on white) and only floating UI gets a shadow.
- Slow, springy, scroll-linked motion that always has a reduced-motion fallback.
- Muted-grey words inside black headlines carry the rhythm of the display line.

## Colors

A gallery-white, ink-black palette with one acidic lime signal.

### Primary
- **Signal Lime** (#dbff04): The only chromatic color. It marks attention and state: the hero circle, 80px icon badges in Why Choose and How It Works, the halo behind an open or hovered service row, the active language pill, the open-menu close button, the chat launcher, and `button-accent`. Text on it is always ink black (lime fails as a text color on white).

### Neutral
- **Ink Black** (#000000): Headlines, primary buttons, the footer background, user chat bubbles and the default focus ring. Body text is ink black at 80% opacity rather than a separate grey.
- **Paper White** (#ffffff): Page background, secondary-button fill, form inputs (inside grey panels), footer text.
- **Graphite** (#333333): Header nav link text at rest; hovers to Ink Black.
- **Slate Mute** (#656973): The faded words inside display headings (for example "Custom … that performs"). Passes 4.5:1 on white.
- **Mist Grey** (#f9f9f9): The one surface tone. Cards, the Let's Talk panel, hovered or open accordion rows, bot chat bubbles.
- **Frost Grey** (#ededed): The sticky header pill, used at 30% opacity behind a 100px backdrop blur.
- **Placeholder Grey** (#6b6b6b): Form placeholder text only.

Supporting alphas of Ink Black carry secondary text: 70–80% for body and meta copy, 60% for labels and inactive language options, 40% for the decorative step numbers, and 10% for hairline borders and chip outlines.

### Named Rules
**The One Signal Rule.** Signal Lime is the only hue on the page and covers well under 10% of any viewport. It marks attention, state or the next action. Never use it as a section background, a text color or decoration.

**The Opacity, Not Greys Rule.** Secondary text is Ink Black at reduced opacity (80 / 70 / 60%), not new grey hexes. Slate Mute exists only for the muted headline words.

## Typography

**Display Font:** Fixel Display (with Arial, Helvetica, sans-serif)
**Body Font:** Fixel Display (same family)

**Character:** A single contemporary grotesque does every job. At 700 and 88px it is assertive and engineered; at 400 and 18px it reads plainly and warmly. Self-hosted, four weights only (400, 500, 600, 700), Latin and Cyrillic, so both locales render identically.

### Hierarchy
- **Display** (700, 60px mobile / 88px desktop, line-height 1.25): Page-hero H1 only. Mixes Ink Black and Slate Mute spans; max width about 760px.
- **Headline** (600, sometimes 700, 36px mobile / 60px desktop): Section H2s (Services, How It Works, FAQ, Let's Talk, Tech Stack). Case-study and legal H2s step down to 30/40px and 24/30px.
- **Title** (700 or 600, 24px mobile / 32px desktop, line-height 1.2): Card and project titles. Accordion questions and service names use the same 32px size at weight 400, so they read as rows rather than headings.
- **Body** (400, 18px, normal line-height): Descriptions and answers, Ink Black at 80% opacity, max about 760px (accordions) or 410px (hero aside). Inline emphasis is weight 700, never color.
- **Body Small** (400, 16px): Nav links, meta lines, timelines, inline links.
- **Label** (400, 16px, uppercase, tracking 0.025em, Ink Black at 60%): Project industry eyebrows.

### Named Rules
**The One Family Rule.** Fixel Display is the only typeface, in four weights only. Build hierarchy with size and weight; do not add a second family or a fifth weight.

**The Muted Word Rule.** Display headlines may fade one or more phrases to Slate Mute to set the rhythm of the line. The key promise stays Ink Black.

## Layout

The page is a single centred column, max 1440px wide, with 16px side gutters on mobile and 80px from `lg` (1024px) up; the header pill and footer content cap at 1280px inside it. Breakpoints are Tailwind defaults, and the main switch is at `lg`: hero copy goes from stacked to a two-column headline + aside, nav collapses into a hamburger and dropdown below it, and button pairs stack full-width below `md`.

Sections stack vertically with generous rhythm: 80px bottom padding at section ends, 40px gaps between major blocks, 24px inside stacks of copy, 8px between related lines. Card padding is 24px mobile / 32px desktop; the Let's Talk panel goes to 48px. Accordion rows (Services, FAQ) run full-bleed with the same 16/80px inner gutters as the container, so their hairlines span the viewport. The sticky header floats 16px from the top over content.

Portfolio uses a responsive grid of project cards (fixed-height covers in sliders, aspect-ratio covers in the grid). Tech Stack and the hero use infinite marquees with edge fades to white.

## Elevation & Depth

The system is flat by default. Depth comes from tone: Mist Grey panels on white, the frosted header pill (30% Frost Grey plus a 100px backdrop blur), and the black footer as the floor of the page. Shadows appear in only two cases: as a response to interaction (button hover) and on UI that floats above the page (chat launcher, chat panel, mobile menu).

### Shadow Vocabulary
- **Chat float** (`box-shadow: 0 24px 64px -12px rgb(0 0 0 / 0.25)`): Chat launcher and chat panel, the only persistent floating layer.
- **Lift on hover** (Tailwind `shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): Buttons on hover, together with a 2px rise; drops to `shadow-sm` on press.
- **Menu drop** (Tailwind `shadow-xl`): The mobile nav dropdown over a 90% white blurred backdrop.

### Named Rules
**The Flat-At-Rest Rule.** Cards, sections and inputs never carry a shadow at rest. A shadow is either a response to the pointer or the mark of a floating layer.

## Shapes

Two shape families. Anything you press or anything that signals is round: pill buttons, the header bar, language toggles and tag chips (100px or full radius), and circles for icon badges, the hero disc, the chat launcher, the active-nav dot and the service-row halo. Content containers are softly squared: 8px for cards, project covers, the Let's Talk panel and FAQ rows; 4px for form inputs. Floating chat UI sits between them at 16px (bubbles) and 24px (panel, mobile menu). Borders are rare and hairline (1px Ink Black at 10%), used for accordion dividers and chip outlines.

**The Round-Means-Action Rule.** Pills and circles are reserved for interactive or signalling elements. Content blocks use 8px corners; never round a card into a pill.

## Components

### Buttons
Confident and tactile: heavy type in a big pill that physically responds.
- **Shape:** Full pill (9999px radius).
- **Primary:** Ink Black fill, white bold text, 56px tall with 24px side padding at 18px type (`md`); 44px tall, 20px padding, 16px type (`sm`).
- **Accent:** Signal Lime fill, Ink Black text, for the rare moment that should be the brightest thing on screen.
- **Secondary:** White fill, black text, for use on dark or grey grounds.
- **Ghost:** No fill, black text; the second action beside a primary (for example "View projects").
- **Hover / Focus:** 200ms ease-in-out; rises 2px and gains `shadow-lg`; press scales to 98% and drops to `shadow-sm`. Focus is a 2px black outline at 2px offset. Reduced motion removes the rise and press.
- **Disabled:** 60% opacity, not-allowed cursor.

### Chips
- **Style:** Transparent fill, 1px Ink Black at 10% outline, 100px radius, 8px × 16px padding, 18px text. Used for project tech tags.
- **Metric chip:** Signal Lime pill over a project cover (bold value + label); stays empty until a real number exists.

### Cards / Containers
- **Corner Style:** Gently rounded (8px).
- **Background:** Mist Grey (#f9f9f9) on white.
- **Shadow Strategy:** None (see the Flat-At-Rest Rule).
- **Border:** None.
- **Internal Padding:** 24px mobile, 32px desktop; 48px for the Let's Talk panel.
- **Project card:** No container; an 8px-rounded cover image that zooms 5% over 500ms on hover, then label, title, two-line summary, chips and an underlined "Read case →" link whose underline drops on hover.

### Inputs / Fields
- **Style:** White fill inside the grey Let's Talk panel, no border, 4px radius, 64px tall, 24px padding, 18px text, Placeholder Grey placeholders. Labels sit above at 16px weight 500; required marks are explicit.
- **Focus:** 2px Ink Black ring.
- **Error:** 14px black helper text tied by `aria-describedby`; color is not the only signal.

### Navigation
- **Header:** A sticky, frosted pill (30% Frost Grey, 100px blur) floating 16px from the top: logo left, links centre, language pill right. Links are 16px Graphite, turning Ink Black on hover; the active page gets an 8px dot before the label, not an underline or a color change.
- **Language switcher:** Short codes (EN / UK) in pills; the active one is Signal Lime, inactive ones are Ink Black at 60%.
- **Mobile:** Below 1024px a hamburger opens a 24px-rounded, 90% white, blurred dropdown with stacked links, a full-width language switcher and a black "free quote" pill; the close control becomes a 44px lime circle.
- **Footer:** Ink Black floor with an oversized white logo (up to 128px type), white nav links with the same dot pattern, and a white focus ring.

### Accordion Rows (signature)
Services and FAQ are full-width rows rather than cards. A 32px question or title at weight 400 and a plus icon that rotates 45° to a cross when open. The row tints to Mist Grey on hover or when open, and Services adds a 76px Signal Lime disc half-hidden off the left edge as the "open" signal. The body expands with a 300ms grid-row transition and is `inert` while closed.

### The Signal Circle (signature)
A large Signal Lime disc (260px desktop, 150px mobile) behind the hero headline. It rises in over 1.1s on `cubic-bezier(0.22, 1, 0.36, 1)` and then drifts on a slow spring as the page scrolls (stiffness 22, damping 18, mass 2.5). Reduced motion keeps it static. It is the brand's one large gesture: one per page, at the top.

### Icon Badge
An 80px Signal Lime circle holding a 35–37px black line icon. It heads each Why Choose and How It Works item; in How It Works it pairs with a large 40%-black step number ("01") in the card corner.

### Chat Widget
A 56px lime launcher fixed bottom-right with the chat float shadow. The panel is white, 380px wide and 24px rounded on desktop, full-screen on mobile. Bot bubbles are Mist Grey, user bubbles Ink Black with white text, and errors are white with a red outline; all at 16px radius and 14px text.

## Do's and Don'ts

### Do:
- **Do** keep Signal Lime (#dbff04) for state and attention: active, open, hovered row, primary signal, the hero circle. One lime moment per viewport is the norm.
- **Do** set lime surfaces with Ink Black text and icons only.
- **Do** build secondary text from Ink Black at 80 / 70 / 60% opacity.
- **Do** use Fixel Display for everything, at 400, 500, 600 or 700.
- **Do** make every interactive control at least 44px tall (buttons 44 or 56px, nav links 44px min height).
- **Do** give every motion a `prefers-reduced-motion` fallback, as the circle, marquees and buttons already have.
- **Do** keep the 2px black focus outline at 2px offset (white on the footer); inside clipped rows, inset it with a negative offset.
- **Do** keep cards flat Mist Grey with 8px corners, and reserve shadows for hover lift and floating chat or menu layers.

### Don't:
- **Don't** introduce a second accent hue or tint lime into gradients or backgrounds.
- **Don't** use Signal Lime as a text color or a full-section background.
- **Don't** add drop shadows to cards, sections or inputs at rest.
- **Don't** add a second typeface or extra weights of Fixel Display.
- **Don't** round content containers into pills, or square off buttons; round means action.
- **Don't** introduce new grey hex values for text when an Ink Black opacity step will do.
- **Don't** fill empty metric chips, testimonial slots or logo rows with placeholder data; leave the element out.
