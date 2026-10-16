# Functional Specification: AI Pre-Sales Chat Assistant

- **Topic:** A chat assistant available on every page that answers visitor questions about Web41's services, prices, process and timelines, and guides interested visitors to the Free Quote form.
- **Status:** Draft
- **Author:** Serhii Kushnir

---

## 1. Overview and Rationale (The "Why")

Visitors to the Web41 site often have one or two quick questions before they ask for a quote: "How much is a landing page?", "How long does it take?", "Webflow or custom code?". Today the only way to get an answer is to read the whole page or write in through the form or email, then wait for a reply. Many visitors leave instead. Maria, the founder on a small budget, is put off by agencies that hide prices and answer slowly. Alex, the product lead, wants a clear scope and timeline before committing.

The assistant answers these questions on the spot, on any page, in the site's own voice. It uses the same services, prices and process the site already shows. It is a pre-sales helper, not a general chatbot. Its job is to remove doubt and move interested visitors to the Free Quote form. It says openly that it is an AI that can make mistakes, and it always offers a way to reach a human.

**Success looks like:**

- Visitors get price and timeline answers without contacting anyone.
- Chats about price, timeline or starting a project lead to the Free Quote form. This counts toward the site-wide goal of at least 3% of unique visitors either submitting the form or starting a chat that hands off to it.
- The assistant never states a price, date or promise that differs from the site.
- Pages load no slower than before the assistant was added.

---

## 2. Functional Requirements (The "What")

### 2.1. Opening and closing the assistant

- A round chat button in the site's accent color sits in the bottom-right corner of every page. It is the only accent-filled element on screen. Clicking it opens the chat panel; while the panel is open the button shows a cross and closes the panel.
  - On large screens the chat opens as a floating panel above the bottom-right corner. On phones and small screens it opens full screen, covering the whole page including the site header, with a clearly visible close button at the top.
  - The chat button is hidden while the mobile navigation menu is open, and it does not appear when a page is printed.
  - The chat button never covers the header's "Free Quote" button or any field of the "Let's talk" form, including on a 375px-wide phone screen.
  - **Acceptance Criteria:**
    - [ ] When the visitor opens any page of the site, then a round accent-colored chat button is visible in the bottom-right corner.
    - [ ] When the visitor clicks the chat button on a desktop screen, then a chat panel opens above the bottom-right corner and the button changes to a cross.
    - [ ] Given the chat panel is open, when the visitor clicks the cross button, then the panel closes and the chat-bubble icon returns.
    - [ ] Given a phone screen 375px wide, when the visitor taps the chat button, then the chat opens full screen and shows a close button at the top that is easy to tap.
    - [ ] Given a 375px-wide phone screen, when the visitor scrolls through the whole home page, then the chat button never covers the "Free Quote" header button or any "Let's talk" form field.
    - [ ] Given the mobile navigation menu is open, when the visitor looks at the screen, then the chat button is not visible.
    - [ ] When the visitor prints any page, then no chat button, panel or teaser appears on the printout.

- After a visitor has been on a page for 20 seconds without opening the chat, a small teaser bubble appears above the chat button: "Questions about your website? Ask me." It has a dismiss (✕) control. It appears at most once per visit, and never on the Privacy Policy or Terms of Use pages.
  - **Acceptance Criteria:**
    - [ ] Given the visitor has not opened the chat, when they stay on the home page for 20 seconds, then a teaser bubble reading "Questions about your website? Ask me." appears above the chat button.
    - [ ] Given the teaser is visible, when the visitor clicks its ✕, then the teaser disappears and does not come back during that visit.
    - [ ] Given the teaser was already shown once, when the visitor moves to another page of the site and waits 20 seconds, then the teaser does not appear again.
    - [ ] When the visitor stays on the Privacy Policy or Terms of Use page for 20 seconds, then no teaser appears.
    - [ ] Given the teaser is visible, when the visitor clicks the teaser text, then the chat panel opens.

### 2.2. What the visitor sees in the panel

- The panel header shows a black round avatar with an accent "41" monogram, the title "Web41 assistant" and a subtitle "AI · usually replies in seconds".
- When the conversation is empty, the panel shows a greeting from the assistant, for example: "Hi! I can help with services, pricing, timelines and how we work." Below it are three suggested questions shown as pill buttons:
  - "How much is a landing page?"
  - "How long does a site take?"
  - "Webflow or custom code?"
- The suggestions disappear once the visitor has sent their first message.
- Under the message box there is a permanent note: "AI can make mistakes. Prefer a human? Email us". "Email us" opens the visitor's email app addressed to the agency's email.
- The chat looks like part of the Web41 site, not a third-party widget. It uses the same fonts, colors, rounded pill shapes and frosted-glass header as the rest of the site.
  - **Acceptance Criteria:**
    - [ ] When the visitor opens the chat for the first time in a visit, then they see the header "Web41 assistant" with the subtitle "AI · usually replies in seconds", a greeting message and three suggested questions.
    - [ ] Given the conversation is empty, when the visitor clicks "How much is a landing page?", then that question is sent as their message and the suggestions disappear.
    - [ ] When the visitor opens the chat, then the line "AI can make mistakes. Prefer a human? Email us" is visible under the message box.
    - [ ] When the visitor clicks "Email us" in that line, then their email app opens a new message addressed to the agency's email.

### 2.3. Asking a question and getting an answer

- The visitor types into a pill-shaped message box and sends with the send button or the Enter key. Shift+Enter starts a new line. The box grows to show up to 4 lines of text, then scrolls.
- A message can be at most 500 characters. From 400 characters on, a counter shows how many characters are used (e.g. "430 / 500"). The visitor cannot type past 500.
- The send button is dimmed and does nothing while the message box is empty.
- The visitor's messages appear on the right in black bubbles with white text. The assistant's messages appear on the left in light grey bubbles.
- While the assistant is preparing an answer, three animated dots show that it is typing. The answer then appears word by word as it is written, rather than all at once after a wait. The first words of an answer appear within about 3 seconds of sending.
- While an answer is being written, the send button becomes a "Stop" button. Pressing it stops the answer where it is. The part already shown stays visible.
- Assistant answers can contain **bold text**, bullet lists and links. Links are underlined. Links to pages of the Web41 site open in the same tab, and links to other websites open in a new tab.
- The message list scrolls to the newest message as it appears.
  - **Acceptance Criteria:**
    - [ ] When the visitor types "How long does a landing page take?" and presses Enter, then their message appears on the right in a black bubble and typing dots appear on the left.
    - [ ] When the assistant replies, then the answer appears word by word in a light grey bubble on the left, with the first words visible within about 3 seconds.
    - [ ] When the visitor presses Shift+Enter in the message box, then a new line starts and nothing is sent.
    - [ ] Given the message box is empty, when the visitor clicks the send button, then nothing is sent and the button stays dimmed.
    - [ ] When the visitor types the 400th character, then a counter "400 / 500" appears, and when they reach 500 characters, then further typing is not accepted.
    - [ ] Given an answer is being written, when the visitor clicks "Stop", then the answer stops growing, the part already shown stays, and the send button returns.
    - [ ] Given an answer contains a link to the Portfolio page, when the visitor clicks it, then the Portfolio page opens in the same tab.

### 2.4. What the assistant will and will not say

- The assistant answers only about Web41 Agency: its six services, prices, process ("How it works"), timelines, FAQs, past projects and how to get in touch. Its information always matches what the site shows.
- Prices are given only as "from $X", using exactly the prices shown on the site (e.g. Landing Page from $100, Low Code from $800, Custom from $1,600). The assistant never makes up prices, deadlines, discounts or guarantees. When it does not know something, it says so and suggests the free quote or email.
- Answers are short, at most about 120 words, in plain language.
- The assistant replies in the language the visitor writes in. All buttons, labels and fixed texts in the chat stay in English.
- Questions unrelated to Web41 or web projects (e.g. "write me a poem", homework, general trivia) are politely declined, and the visitor is steered back to what the assistant can help with.
- The assistant never asks for sensitive information such as passwords or card numbers, and does not repeat such information if a visitor types it.
  - **Acceptance Criteria:**
    - [ ] When the visitor asks "How much does a landing page cost?", then the answer states "from $100" (the same price shown in the site's Services section) and no other price for that service.
    - [ ] When the visitor asks for a price of every service, then each price in the answer matches the price shown on the site exactly.
    - [ ] When the visitor asks "Write me a poem about cats", then the assistant politely declines and offers help with Web41 services instead.
    - [ ] When the visitor asks "Can you guarantee my site is done by Friday?", then the assistant does not promise a date and suggests requesting a free quote.
    - [ ] When the visitor asks a question in Ukrainian, then the answer is in Ukrainian while the chat's buttons and labels stay in English.
    - [ ] When the visitor types "my card number is 4111 1111 1111 1111", then the assistant does not repeat the number and does not ask for payment details.
    - [ ] When the visitor asks any question, then the answer is no longer than about 120 words.

### 2.5. Handing off to the Free Quote form

- When the visitor asks about price, timeline or starting a project, the assistant's answer ends with a handoff card: a black card with a short line (e.g. "Want an exact quote?") and an accent "Get a free quote →" button.
- Clicking "Get a free quote →" closes the chat panel and takes the visitor to the "Let's talk" form, so the form is visible on screen. If the visitor is on another page, they are taken to the form on the home page.
- Answers to general questions that are not about price, timeline or starting a project do not show the handoff card.
  - **Acceptance Criteria:**
    - [ ] When the visitor asks "How much is a Webflow site?", then the answer ends with a black card containing a "Get a free quote →" button.
    - [ ] Given a handoff card is shown on the home page, when the visitor clicks "Get a free quote →", then the chat closes and the page scrolls to the "Let's talk" form.
    - [ ] Given a handoff card is shown on the Portfolio page, when the visitor clicks "Get a free quote →", then the home page opens at the "Let's talk" form and the chat is closed.
    - [ ] When the visitor asks "What is UI/UX design?", then the answer has no handoff card.

### 2.6. Keeping the conversation during a visit

- The conversation stays in place while the visitor moves between pages of the site and when they close and reopen the panel during the same visit.
- When the visitor closes the browser tab and comes back later, the chat starts fresh with the greeting and suggestions.
- The panel header has a "Start over" icon button next to the close button. It clears the conversation and shows the greeting and suggested questions again. It is disabled while the conversation is empty.
  - **Acceptance Criteria:**
    - [ ] Given the visitor has exchanged messages, when they click "Start over" in the panel header, then all messages disappear and the greeting and three suggested questions are shown again.
    - [ ] Given the conversation is empty, when the visitor looks at the panel header, then the "Start over" button is disabled.
    - [ ] Given the visitor has exchanged two messages, when they close the panel and open it again, then the same messages are still there.
    - [ ] Given the visitor has exchanged two messages on the home page, when they go to the Portfolio page and open the chat, then the same messages are still there.
    - [ ] Given the visitor had a conversation, when they close the tab, open the site in a new tab and open the chat, then they see only the greeting and suggested questions.

### 2.7. Limits and errors

- A visitor can send up to 20 messages in 10 minutes and up to 60 messages per day. When they reach a limit, the chat shows the message "You've hit the message limit. Email us at [agency email]." with a clickable email link, and the message box cannot be used until the limit resets.
- A conversation can hold up to 20 messages in total (visitor and assistant together). When it reaches 20, the message box is disabled and the chat shows: "This chat is getting long. Start a new one, or get a free quote and we'll answer in detail." with two buttons: "Start over" (clears the conversation) and "Get a free quote →" (same behavior as the handoff card).
- If the assistant cannot answer because of a connection problem or because the service is unavailable, the chat shows an error bubble outlined in red: "Sorry, something went wrong. Try again or email us at [agency email]." It has a "Try again" button that resends the last message.
- If the site owner switches the assistant off, the chat button does not appear anywhere on the site.
  - **Acceptance Criteria:**
    - [ ] Given the visitor has sent 20 messages in the last 10 minutes, when they send another one, then they see "You've hit the message limit. Email us at [agency email]." and cannot send more messages.
    - [ ] Given the conversation already holds 20 messages, when the visitor looks at the chat, then they see "This chat is getting long. Start a new one, or get a free quote and we'll answer in detail." with "Start over" and "Get a free quote →" buttons, and the message box is disabled.
    - [ ] Given the long-chat note is shown, when the visitor clicks "Start over", then the conversation clears and the message box can be used again.
    - [ ] Given the limit message is shown, when the visitor clicks the email address, then their email app opens a new message to the agency.
    - [ ] Given the assistant service is unavailable, when the visitor sends a message, then a red-outlined error bubble with "Try again" and the email address appears instead of an answer.
    - [ ] Given the error bubble is shown and the service is available again, when the visitor clicks "Try again", then their last message is sent again and an answer appears.
    - [ ] Given the owner has switched the assistant off, when the visitor opens any page, then no chat button is visible.

### 2.8. Accessibility and motion

- The whole chat can be used with the keyboard alone. The visitor can open it, type, send and close it with the Escape key.
- When the chat opens, the cursor is placed in the message box. When it closes, keyboard focus returns to the chat button.
- Screen readers announce the chat button as "Open chat" or "Close chat". They read each finished answer once, not word by word while it is being written. The message box is announced as "Message".
- Every clickable element in the chat is at least 44×44px.
- Text in the chat is 16px, so phones do not zoom in when the visitor taps the message box.
- On phones, the message box stays visible above the on-screen keyboard.
- Opening and closing use a short fade-and-rise animation (about 200 ms). When the visitor's device is set to reduce motion, there are no animations. The panel just appears and disappears, and the typing dots do not move.
  - **Acceptance Criteria:**
    - [ ] When a keyboard-only visitor tabs to the chat button and presses Enter, then the panel opens and the cursor is in the message box.
    - [ ] Given the panel is open, when the visitor presses Escape, then the panel closes and keyboard focus is on the chat button.
    - [ ] When a screen reader user receives an answer, then the screen reader reads the full answer once after it finishes, not piece by piece.
    - [ ] When a screen reader user focuses the chat button, then it is announced as "Open chat" (or "Close chat" when the panel is open).
    - [ ] Given the device is set to reduce motion, when the visitor opens the chat and waits for an answer, then nothing slides or fades and the typing dots stay still.
    - [ ] Given an iPhone, when the visitor taps the message box, then the page does not zoom in and the message box stays visible above the keyboard.

### 2.9. Page speed

- Adding the assistant must not make the site feel slower. The chat loads only after the page itself has appeared, and the page's main content shows as quickly as before.
  - **Acceptance Criteria:**
    - [ ] When the home page is opened on a phone connection, then the main content appears as quickly as it did before the assistant was added, and the chat button appears after the page content.

### 2.10. Privacy notice

- The Privacy Policy gains a "Chat assistant" section. It explains that chat messages are sent to an AI provider (OpenAI) to generate replies, that Web41 does not keep chat conversations after the visit ends, and that visitors should not share sensitive information in the chat.
- The Privacy Policy's "At a glance" point about collecting only what visitors send through the form or email is updated to mention the chat as well.
  - **Acceptance Criteria:**
    - [ ] When the visitor opens the Privacy Policy, then it has a "Chat assistant" section that names OpenAI as the provider and states that conversations are not kept after the visit.
    - [ ] When the visitor reads the "At a glance" summary on the Privacy Policy, then the point about what is collected mentions the chat alongside the form and email.

---

## 3. Scope and Boundaries

### In-Scope

- Chat button, optional teaser bubble and chat panel on every page (desktop floating panel, mobile full screen).
- Greeting, suggested questions, typed questions, answers that appear word by word, and a stop control.
- Answers limited to Web41 topics, with prices and facts matching the site.
- Handoff card that takes visitors to the "Let's talk" form.
- Conversation kept for the length of a visit, with a "Start over" control.
- Message limits, error state with retry, an email fallback, and an owner on/off switch.
- Keyboard, screen-reader, reduced-motion and print behavior.
- Privacy Policy update describing the chat.

### Out-of-Scope

- Collecting the visitor's name and email inside the chat and sending them as a quote request (phase 2, after the contact form backend ships).
- Saving chat conversations for the agency to read, and any admin view of chats.
- Translated versions of the chat's buttons and labels (multiple UI languages).
- Live chat with a human agent.
- Answering general questions unrelated to Web41.

---

## Change Log

- [YYYY-MM-DD] — [source reference] — [what behavior changed and why]
