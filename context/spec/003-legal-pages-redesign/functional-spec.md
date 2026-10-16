# Functional Specification: Privacy Policy & Terms of Use Redesign

- **Topic:** Redesign the Privacy Policy and Terms of Use pages so they match the rest of the site and are easy to scan
- **Status:** Completed
- **Author:** Serhii Kushnir

---

## 1. Overview and Rationale (The "Why")

The Privacy Policy and Terms of Use pages exist today, but they look like plain walls of text. They do not
match the bold black-and-white style with the lime accent used on the rest of the site. For a small agency
whose main sales channel is its website, a plain legal page is a small but real trust gap. A founder like
"Maria", or a product lead like "Alex" who is checking whether Web41 is a serious company, lands on a page
that looks unfinished.

People do not read legal pages from top to bottom. They come with one question ("Do you sell my data?",
"Who owns the work shown in the portfolio?"), look for the answer, and leave. The redesign follows the
pattern used by well-known product companies:

- a plain-language summary first;
- a table of contents that is always visible;
- numbered sections you can link to directly;
- a clear "last updated" date;
- an obvious way to ask a question.

**Desired outcome:** a visitor can find the answer to a specific privacy or terms question within about
30 seconds, and both pages look like part of the same site as the home and portfolio pages.

**How we will know it worked:**

- Both pages use the same layout and visual style as the rest of the site, and a reviewer cannot tell them
  apart in quality from the home page.
- A tester can jump to any section from the table of contents in one click or tap.
- The pages work well on a 375px-wide phone with no sideways scrolling.

---

## 2. Functional Requirements (The "What")

### 2.1. Page header

The top of each legal page shows, in this order:

- a breadcrumb trail ("Legal / Privacy Policy" or "Legal / Terms of Use");
- the page title;
- a one-sentence description;
- two small rounded labels, one for "Updated <date>" and one for "<N> min read";
- a two-option switcher that lets the visitor move between Privacy Policy and Terms of Use.

The date is written out in full (for example "September 18, 2026"). Reading time is based on an average
reading speed of 200 words per minute, rounded up, with a minimum of 1 minute. The "Legal" part of the
breadcrumb is plain text, not a link. There is no separate "Legal" overview page.

- **Acceptance Criteria:**
  - [x] When the visitor opens the Privacy Policy page, then they see the breadcrumb "Legal / Privacy Policy", the title "Privacy Policy", a one-sentence description, an "Updated <full date>" label and a "<N> min read" label.
  - [x] When the visitor opens the Terms of Use page, then they see the same header structure with "Terms of Use" as the title and in the breadcrumb.
  - [x] Given the policy was last updated on September 18, 2026, when the visitor views the header, then the label reads "Updated September 18, 2026", not "September 17" and not a numeric format.
  - [x] Given the visitor is on the Privacy Policy page, when they look at the switcher, then "Privacy Policy" is shown as the selected option (black background, white text) and "Terms of Use" as unselected (outlined).
  - [x] Given the visitor is on the Privacy Policy page, when they click "Terms of Use" in the switcher, then the Terms of Use page opens with "Terms of Use" selected in the switcher.
  - [x] When the visitor clicks "Legal" in the breadcrumb, then nothing happens, because it is not a link.

### 2.2. "At a glance" summary

Before the full legal text, each page shows an "At a glance" card with 4 short, plain-language points. Each
point has a small check mark in the site's lime accent colour. On tablet and desktop the points are in two
columns; on a phone they are in one column.

Privacy Policy points (draft wording):

- "We only collect what you send us through the form or by email."
- "No tracking or advertising cookies."
- "We never sell your data."
- "Ask us anytime to see or delete your data."

Terms of Use points:

- "You can browse the site and contact us freely."
- "Prices and timelines on the site are a guide, not an offer."
- "Our design and content belong to us; client work belongs to our clients."
- "Each project is agreed separately, in writing."

- **Acceptance Criteria:**
  - [x] When the visitor opens either legal page, then an "At a glance" card with exactly 4 points appears above the introduction paragraph.
  - [x] Given the screen is at least tablet width (768px), when the visitor views the card, then the points are arranged in two columns of two.
  - [x] Given a 375px-wide phone, when the visitor views the card, then the points are shown in a single column with no text cut off.
  - [x] When the visitor reads the Privacy Policy summary, then every point matches something the full policy below actually says. No point promises more than the policy does.

### 2.3. Numbered, linkable sections

The full legal text is split into numbered sections ("01", "02", …). The number appears in a lighter grey
next to a large bold heading. A thin divider line separates the sections. Bullet lists use small custom dots
instead of standard bullets. Body text is kept to a comfortable reading width of roughly 65–75 characters
per line.

Each section heading has a "#" link next to it. On desktop it appears when the visitor hovers over the
heading or reaches it with the keyboard. On phones it is always shown, faded. Clicking "#" moves the page to
that section and puts the section's address in the browser's address bar, so the visitor can copy and share
it.

When anyone opens a link to a specific section, the page opens at that section. The section heading is fully
visible and not hidden behind the site's top navigation bar.

- **Acceptance Criteria:**
  - [x] When the visitor scrolls through either legal page, then every section heading shows a two-digit number (01, 02, 03…) in order with no gaps.
  - [x] Given a desktop screen, when the visitor hovers over a section heading, then a "#" link appears next to it, and when the pointer moves away, then it disappears.
  - [x] Given a 375px-wide phone, when the visitor views a section heading, then the "#" link is visible in a faded style without tapping anything.
  - [x] When the visitor clicks a section's "#" link, then the browser address changes to that section's address and the section heading sits just below the top navigation bar.
  - [x] When a visitor opens a direct link to the "Cookies and analytics" section of the Privacy Policy in a new tab, then the page opens at that section with its heading fully visible below the navigation bar.
  - [x] When the visitor reads a section that contains a list, then each list item has a small custom dot marker, not a default browser bullet.

### 2.4. Table of contents

On desktop (1024px and wider) a list of all section titles, labelled "On this page", sits to the left of the
text. It stays visible while the visitor scrolls. The section currently on screen is highlighted in bold
black with a short bar beside it; the other items are grey. Clicking an item jumps to that section.

On phones and tablets the same list appears as a collapsed "On this page" card above the summary. Tapping it
opens the list. Tapping a section title jumps to that section and closes the list.

- **Acceptance Criteria:**
  - [x] Given a desktop screen, when the visitor scrolls from the top to the bottom of the page, then the "On this page" list stays visible on the left the whole time.
  - [x] Given a desktop screen, when the visitor scrolls so that a section reaches the upper part of the screen, then that section's title is highlighted in the list and the previously highlighted title returns to grey.
  - [x] Given a desktop screen, when the visitor first opens the page and has not scrolled yet, then the first section ("01") is highlighted.
  - [x] Given a desktop screen, when the visitor scrolls to the very bottom of the page, then the last section is highlighted, even if it is short.
  - [x] Given a desktop screen, when the visitor clicks a title in the list, then the page moves to that section and that title becomes highlighted.
  - [x] Given a 375px-wide phone, when the page loads, then the "On this page" card is collapsed and the full list is hidden.
  - [x] Given a 375px-wide phone, when the visitor taps "On this page" and then taps a section title, then the page moves to that section and the card closes.
  - [x] Given the visitor's device is set to reduce motion, when they click a title in the list, then the page jumps to the section without a scrolling animation.

### 2.5. Contact card and cross-link

At the end of the legal text a black card with white text asks "Questions about this policy?" on the
Privacy Policy page, or "Questions about these terms?" on the Terms of Use page. It has one short line of
supporting copy, a lime "Email us" button that opens the visitor's email app addressed to the agency's
contact email, and the email address written out as text.

Below the card, an "Also read: <other document> →" link leads to the other legal page.

The site's existing "Let's talk" contact form stays at the bottom of both legal pages, as on the rest of the
site, because the "Free Quote" button in the top navigation leads to it.

- **Acceptance Criteria:**
  - [x] When the visitor reaches the end of the Privacy Policy, then they see a black card reading "Questions about this policy?", the agency's email address as text, and a lime "Email us" button.
  - [x] When the visitor clicks "Email us", then their email app opens with a new message addressed to the agency's contact email.
  - [x] When the visitor reaches the end of the Terms of Use, then the card reads "Questions about these terms?" and the link below it reads "Also read: Privacy Policy →".
  - [x] When the visitor clicks "Also read: Terms of Use →" on the Privacy Policy page, then the Terms of Use page opens.
  - [x] When the visitor clicks "Free Quote" in the top navigation while on a legal page, then the page scrolls to the "Let's talk" form at the bottom of the same page.

### 2.6. Privacy Policy content additions

Two short sections are added to the Privacy Policy, just before "Contact":

- **"How we protect your data"**: the site uses a secure (HTTPS) connection, only the Web41 team can see
  enquiries, and we use well-known, reputable service providers.
- **"Children"**: the site is not aimed at children under 16, and we do not knowingly collect their data.

All existing sections and their wording stay as they are. The summary and the new sections must not claim
anything the site does not actually do.

- **Acceptance Criteria:**
  - [x] When the visitor views the Privacy Policy table of contents, then "How we protect your data" and "Children" appear directly before "Contact".
  - [x] When the visitor reads the "Children" section, then it states that the site is not aimed at people under 16.
  - [x] When a reviewer compares the old and new Privacy Policy, then every section that existed before is still present with unchanged wording.

### 2.7. Phone, keyboard and print use

- **Phone:** at 375px width nothing on either page causes sideways scrolling, including long words such as
  the email address, and the two-option switcher fits on one line.
- **Keyboard:** every link and button (switcher, table of contents, "#" links, "Email us", "Also read") can
  be reached with the Tab key and shows a clearly visible focus outline, including on the black contact card.
  Every tappable element is at least 44px tall.
- **Print:** when a visitor prints a legal page, only the header text and the legal content are printed, at
  full page width. The table of contents, switcher, "Email us" button and "Let's talk" form are left out.

- **Acceptance Criteria:**
  - [x] Given a 375px-wide phone, when the visitor swipes left and right on either legal page, then the page does not move sideways.
  - [x] Given a 375px-wide phone, when the visitor views the switcher, then both options fit on a single line.
  - [x] When the visitor presses Tab repeatedly from the top of the page, then focus moves through the switcher, the table of contents, each "#" link, "Email us" and "Also read", with a visible outline on each one.
  - [x] Given focus is on the "Email us" button inside the black card, when the visitor looks at it, then the focus outline is clearly visible against the black background.
  - [x] When the visitor opens the browser's print preview on either legal page, then it shows the title, date, summary and all sections at full width, and no table of contents, switcher, "Email us" button or "Let's talk" form.

### 2.8. Addresses and search appearance

The pages keep their current web addresses (/privacy-policy and /terms-of-use), so existing links in the
footer and in the contact form's consent line keep working. When a legal page is shared on social media or
messaging apps, the preview shows the page's own title and description together with the site's usual
preview image.

- **Acceptance Criteria:**
  - [x] When the visitor clicks "Privacy Policy" or "Terms of Use" in the site footer, then the redesigned page opens at the same address as before.
  - [x] When someone pastes the Privacy Policy address into a messaging app that shows link previews, then the preview shows the title "Privacy Policy", its description and the site's standard preview image.

---

## 3. Scope and Boundaries

### In-Scope

- New layout and visual style for the Privacy Policy and Terms of Use pages: header, summary, numbered
  sections, table of contents, contact card and cross-link.
- "At a glance" summaries for both pages.
- Two new Privacy Policy sections: "How we protect your data" and "Children".
- Full date format for "last updated" and an estimated reading time.
- Phone, keyboard and print behaviour as described above.
- Better link previews when the pages are shared.

### Out-of-Scope

- Legal accuracy of the existing text. Open owner and legal review notes (retention period, governing-law
  jurisdiction, naming the email provider) stay unresolved here.
- Rewording the Privacy Policy's contact-form description, which will change when the contact form
  backend (spec 002) ships.
- A cookie banner or consent management. The site sets no cookies.
- New legal documents, such as a separate cookie policy or a "Legal" overview page.
- Changes to the web addresses of the legal pages.

---

## Change Log

_Leave empty until the first amendment._

---

## Verification Evidence

- Full Playwright suite run once: 82/82 passed (tests/e2e/legal-pages.spec.ts, `@spec: 003-legal-pages-redesign`) — covers header, switcher, summary, sections/anchors, TOC, contact card, mobile/keyboard/print, SEO, sitemap, Privacy content.
- Look-and-feel confirmed by the owner from: docs/screenshots/003-legal-pages-redesign-privacy-desktop.png, -terms-desktop.png, -privacy-mobile.png, -contact-card.png.
