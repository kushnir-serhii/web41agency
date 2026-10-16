# Functional Specification: Multilingual Site — Ukrainian Version

- **Topic:** Offer the whole Web41 website in Ukrainian alongside the existing English version, with a visible language switcher.
- **Status:** Draft
- **Author:** Serhii Kushnir

---

## 1. Overview and Rationale (The "Why")

The Web41 website is currently available only in English. A large share of potential clients, such as small business owners and founders in Ukraine, are more comfortable reading about services, timelines and terms in Ukrainian. Right now they either struggle through English, misread details, or leave without sending a request.

This change adds a full Ukrainian version of the site. Visitors can read every page in Ukrainian, switch between English and Ukrainian at any time, and find the Ukrainian pages directly from search engines.

This replaces the earlier product assumption that multi-language versions are out of scope.

**Success looks like:**

- Ukrainian-speaking visitors can complete the whole journey in Ukrainian: hero → services → portfolio → AI assistant → Free Quote form.
- Ukrainian pages appear in search results for Ukrainian-language queries.
- Free Quote requests arrive from visitors who used the Ukrainian version. The agency can see this on each request.

---

## 2. Functional Requirements (The "What")

### 2.1. Two languages: English and Ukrainian

- The site is available in two languages: English (the current default) and Ukrainian.
- English pages keep their current addresses unchanged (for example `/services`). Each Ukrainian page has the same address with a `/uk` prefix (for example `/uk/services`, `/uk/portfolio/<case study>`). The Ukrainian home page is `/uk`.
- Every page can be shared or bookmarked in a specific language.
  - **Acceptance Criteria:**
    - [ ] When the visitor opens `/uk/services`, then the Services page loads fully in Ukrainian.
    - [ ] When the visitor opens `/services`, then the Services page loads fully in English, exactly as before this change.
    - [ ] When the visitor opens any address that worked before this change, then the same English page opens, with no "page not found" and no redirect to another address.
    - [ ] When the visitor copies the address of a Ukrainian page and opens it in a new browser window, then the same page opens in Ukrainian.

### 2.2. Language switcher

- A language switcher is visible in the site header on every page.
- **Desktop:** a compact pill-shaped two-option toggle reading **EN | UA**, placed at the right end of the header bar. Its rounded shape matches the header. The selected language sits on the site's yellow accent background, and the other option is plain text that darkens on hover. No flags are used.
- **Mobile:** inside the opened mobile menu, a full-width two-option toggle reading **English | Українська**, placed above the "Free Quote" button.
- Each option is announced to screen readers by its full language name, written in that language ("English", "Українська").
- Switching the language keeps the visitor on the same page, at the top of the page. For example, the English Services page switches to the Ukrainian Services page, not to the home page.
  - **Acceptance Criteria:**
    - [ ] Given the visitor is on the English Services page, when they choose "UA" in the switcher, then the Ukrainian Services page opens.
    - [ ] Given the visitor is on a Ukrainian case study page, when they choose "EN", then the same case study opens in English.
    - [ ] When the visitor opens the mobile menu, then the "English | Українська" switcher appears above the "Free Quote" button and works the same way as on desktop.
    - [ ] When the visitor looks at the switcher, then the current language is shown on the yellow accent background and the other option looks clickable.
    - [ ] When the visitor chooses the language that is already selected, then nothing changes and the page does not reload.
    - [ ] When a keyboard-only visitor tabs to the switcher and presses Enter on the other language, then the page switches language, and the focus outline is clearly visible on the switcher.
    - [ ] When a screen reader reaches the switcher, then it announces it as language selection, reads each option's full name, and indicates which one is currently selected.

### 2.3. Which language a visitor sees first

- On the first visit to the home page, the visitor sees the language that matches their browser: Ukrainian if their browser prefers Ukrainian, otherwise English.
- Once a visitor picks a language with the switcher, the site remembers the choice on later visits.
- A visitor who opens a direct link to a specific language version always sees that version and is never redirected.
  - **Acceptance Criteria:**
    - [ ] Given the browser language is Ukrainian, when the visitor opens the home page for the first time, then the Ukrainian home page is shown.
    - [ ] Given the browser language is anything other than Ukrainian, when the visitor opens the home page for the first time, then the English home page is shown.
    - [ ] Given the visitor switched to English earlier, when they come back to the home page later, then the English version is shown, even if their browser prefers Ukrainian.
    - [ ] When the visitor opens a direct link to any Ukrainian or English page other than the home page, then that page is shown in that language without a redirect, whatever their browser language.

### 2.4. Translated content

Everything a visitor reads is shown in the selected language:

- Header navigation, footer, buttons and all calls to action.
- Home page: hero, services, "How it works", "Why choose us", tech stack captions, portfolio preview, FAQ and the "Let's talk" section.
- About Us, Services, Portfolio and Contacts pages.
- Every case study page: problem, solution and results.
- Privacy Policy and Terms of Use, fully translated. Each Ukrainian legal page states near the top that the English version prevails if the two versions ever differ.
- Page titles and descriptions shown in browser tabs, search results and social share previews.
- Image descriptions for screen readers.
- Dates on the page (such as "Last updated" on legal pages) are written in Ukrainian format on Ukrainian pages.

The Ukrainian copy is prepared as a draft translation during implementation and proofread by the site owner before launch.

  - **Acceptance Criteria:**
    - [ ] When the visitor browses any page in Ukrainian, then no English sentences are visible, except brand, technology and project names (e.g. "Web41", "Webflow", "React").
    - [ ] When the visitor opens the Ukrainian Privacy Policy, then the full policy is in Ukrainian and a note near the top says the English version prevails.
    - [ ] When the visitor opens a Ukrainian legal page, then its "last updated" date is in Ukrainian format (e.g. "15 жовтня 2026").
    - [ ] When the visitor views a Ukrainian page in a browser tab, then the tab title is in Ukrainian.
    - [ ] When a Ukrainian page is shared in a messenger or on a social network, then the preview title and description are in Ukrainian.
    - [ ] When the visitor follows any link or call-to-action button on a Ukrainian page, then they land on a Ukrainian page.

### 2.5. Free Quote form in Ukrainian

- On Ukrainian pages, the "Let's talk" form shows its field labels, placeholders, validation messages, the success message and the error message in Ukrainian.
- Every request the agency receives shows which language the visitor used, for example "Language: Ukrainian" or "Language: English".
  - **Acceptance Criteria:**
    - [ ] Given the visitor is on a Ukrainian page, when they submit the form with an empty name, then they see the "name is required" message in Ukrainian.
    - [ ] Given the visitor is on a Ukrainian page, when they submit a valid form, then they see the success message in Ukrainian.
    - [ ] Given the visitor is on a Ukrainian page, when sending the form fails, then they see the error message in Ukrainian.
    - [ ] When a visitor submits the form from a Ukrainian page, then the request arrives in the agency inbox and shows "Language: Ukrainian".
    - [ ] When a visitor submits the form from an English page, then the request arrives in the agency inbox and shows "Language: English".

### 2.6. AI assistant in Ukrainian

- On Ukrainian pages, the AI assistant's interface (launcher, teaser, greeting, suggested questions, input placeholder, notices and errors) is in Ukrainian.
- The assistant replies in Ukrainian when the visitor is on a Ukrainian page or writes in Ukrainian. If the visitor writes in English, the assistant replies in English.
- When the assistant mentions prices, it uses the same "from $X" amounts in US dollars in both languages.
- When the assistant hands the visitor over to the Free Quote form, it takes them to the form on a page in the current language.
- Switching language does not clear the conversation. Earlier messages stay as they were, and the interface and new replies follow the new language.
  - **Acceptance Criteria:**
    - [ ] Given the visitor is on a Ukrainian page, when they open the chat, then the greeting and suggested questions are in Ukrainian.
    - [ ] Given the visitor is on a Ukrainian page, when they ask "Скільки коштує лендінг?", then the reply is in Ukrainian and quotes the same "from $X" amount as the English assistant.
    - [ ] Given the visitor is on a Ukrainian page, when the assistant suggests the free quote and the visitor accepts, then they land on the Ukrainian "Let's talk" form.
    - [ ] Given the visitor had a conversation on an English page, when they switch to Ukrainian and open the chat, then the earlier messages are still visible and the chat interface is in Ukrainian.

### 2.7. Search engines

- Search engines can find both language versions of every page and know which pages are translations of each other. Ukrainian searchers are shown Ukrainian pages, and everyone else is shown English pages.
- The site map lists both language versions of every page.
  - **Acceptance Criteria:**
    - [ ] When the site map is opened, then every page is listed in both English and Ukrainian.
    - [ ] When a search engine's page inspection tool checks any Ukrainian page, then it reports the page as Ukrainian and linked to its English counterpart.

### 2.8. Missing pages

- A visitor who opens a Ukrainian address that does not exist sees a "page not found" message in Ukrainian, with a link back to the Ukrainian home page.
  - **Acceptance Criteria:**
    - [ ] When the visitor opens a non-existent address under `/uk`, then they see a Ukrainian "page not found" message with a link to the Ukrainian home page.

---

## 3. Scope and Boundaries

### In-Scope

- Ukrainian version of every existing public page, including case studies and the legal pages.
- Language switcher in the header (desktop) and in the mobile menu.
- First-visit language from the browser, and remembering the visitor's choice.
- Ukrainian Free Quote form messages, and a language mark on every request the agency receives.
- Ukrainian AI assistant interface and replies.
- Ukrainian page titles, descriptions and social share previews, and both languages listed for search engines.
- A draft Ukrainian translation of all copy, for the owner to proofread.

### Out-of-Scope

- Languages other than English and Ukrainian.
- Showing prices on the pages, or in any currency other than US dollars.
- Translating the earlier messages of an ongoing chat conversation after a language switch.
- Any change to the English content or the English page addresses.

---

## Change Log

_Dated amendments made after the spec was first written — typically by `/awos:spec` in Update Mode when a bug fix changed documented behavior. Each entry records the date, the source reference (bug id or fix description), and what behavior changed and why. Leave empty until the first amendment._
