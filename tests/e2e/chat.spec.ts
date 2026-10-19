import { expect, test } from '@playwright/test';

/*
 * @spec: 004-ai-chatbot - acceptance traceability (functional-spec.md AC -> describe block).
 * Every describe block carries the tags below (filter: --grep @spec:004-ai-chatbot).
 *
 * 2.1 button/panel/mobile/menu/print ... 'launcher and panel', 'mobile, keyboard, reduced motion and print',
 *                                         'acceptance: launcher placement and desktop panel'
 * 2.1 teaser ............................ 'persistence, suggestions, Start over and teaser',
 *                                         'acceptance: teaser on terms-of-use'
 * 2.2 header, greeting, pills, email .... 'acceptance: panel content and composer'
 * 2.3 send/stream/stop .................. 'send and streamed answer', 'limits, errors, retry, long chat and Stop'
 * 2.3 counter/500 cap, bubbles, links ... 'acceptance: composer limits, bubbles and links'
 * 2.5 handoff ........................... 'handoff card', 'acceptance: handoff card layout'
 * 2.6 persistence ....................... 'persistence, suggestions, Start over and teaser'
 * 2.7 limits/errors ..................... 'limits, errors, retry, long chat and Stop'
 * 2.7 kill switch ....................... Vitest src/server/chat/chat.test.ts (isChatEnabled, route 503, layout gate)
 * 2.8 keyboard/focus/motion ............. 'mobile, keyboard, reduced motion and print',
 *                                         'acceptance: touch targets and font size'
 * 2.9 loads after content ............... 'acceptance: chat loads after page content', 'acceptance: page content does not wait for chat'
 * 2.10 privacy policy ................... 'acceptance: privacy policy chat section'
 *
 * @spec:005-multilingual-site-ukrainian (FS 2.6, last describe block 'chat in Ukrainian'): uk greeting/suggestions,
 *      request locale, handoff to /uk#lets-talk, conversation kept across a language switch.
 *      MANUAL: real Ukrainian reply quality and quoting the same "from $X" (model behaviour; prompt in chat.test.ts).
 *
 * MANUAL (pre-launch, need the real model or a real device):
 *  2.4 prices, poem refusal, no Friday guarantee, Ukrainian reply, card number, <=120 words (model behaviour;
 *      the deterministic part is the system prompt, tested in chat.test.ts)
 *  2.5 which questions get a card (model judgement; the card itself is mocked here)
 *  2.8 VoiceOver reads the answer once; iPhone zoom and keyboard (real device; 16px font is asserted here)
 *  2.9 Lighthouse mobile vs main
 */
const SPEC_TAGS = ['@spec:004-ai-chatbot', '@regression'];

const launcher = (page: import('@playwright/test').Page) =>
  page.locator('button[aria-controls="chat-panel"]');

test.describe('chat launcher and panel', { tag: SPEC_TAGS }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
  });

  test('launcher is visible on /', async ({ page }) => {
    await expect(launcher(page)).toHaveAccessibleName('Open chat');
  });

  test('click opens and closes the panel', async ({ page }) => {
    await launcher(page).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(launcher(page)).toHaveAccessibleName('Close chat');
    await expect(page.getByRole('dialog').getByLabel('Message')).toBeFocused();

    await launcher(page).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(launcher(page)).toHaveAccessibleName('Open chat');
  });

  test('Escape closes the panel and returns focus to the launcher', async ({ page }) => {
    await launcher(page).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(launcher(page)).toBeFocused();
  });

  test('launcher is hidden while the mobile menu is open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await expect(launcher(page)).toBeVisible();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator('html[data-menu-open]')).toHaveCount(1);
    await expect(launcher(page)).toBeHidden();
  });
});

test.describe('chat send and streamed answer', { tag: SPEC_TAGS }, () => {
  const ANSWER = 'We build fast Next.js websites for startups.';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await launcher(page).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('Enter sends, typing dots show, then the answer replaces them', async ({ page }) => {
    const bodies: { messages: { role: string; content: string }[] }[] = [];
    await page.route('**/api/chat', async (route) => {
      bodies.push(route.request().postDataJSON());
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: ANSWER,
      });
    });

    const dialog = page.getByRole('dialog');
    const log = dialog.getByRole('log', { name: 'Web41 assistant' });
    const input = dialog.getByLabel('Message');
    await input.fill('What do you build?');
    await input.press('Enter');

    await expect(log.getByText('What do you build?')).toBeVisible();
    await expect(input).toHaveValue('');
    const dots = dialog.locator('div[aria-hidden="true"] span.rounded-full');
    await expect(dots).toHaveCount(3);
    await expect(dialog.getByRole('button', { name: 'Stop' })).toBeVisible();

    await expect(log.getByText(ANSWER)).toBeVisible();
    const announcer = dialog.locator(':scope > [role="status"]');
    await expect(announcer).toContainText(ANSWER);
    await expect(announcer.getByText(ANSWER)).toHaveCount(1);
    await expect(dots).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'Send' })).toBeDisabled();

    expect(bodies).toHaveLength(1);
    const last = bodies[0].messages.filter((m) => m.role === 'user').at(-1);
    expect(last?.content).toBe('What do you build?');
  });

  test('Shift+Enter adds a newline and does not send', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/chat', async (route) => {
      calls += 1;
      await route.fulfill({ status: 200, contentType: 'text/plain', body: ANSWER });
    });
    const input = page.getByRole('dialog').getByLabel('Message');
    await input.fill('line one');
    await input.press('Shift+Enter');
    await input.pressSequentially('line two');
    await expect(input).toHaveValue('line one\nline two');
    expect(calls).toBe(0);
  });

  test('empty send does nothing', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/chat', async (route) => {
      calls += 1;
      await route.fulfill({ status: 200, contentType: 'text/plain', body: ANSWER });
    });
    const dialog = page.getByRole('dialog');
    const log = dialog.getByRole('log', { name: 'Web41 assistant' });
    const input = dialog.getByLabel('Message');
    await expect(dialog.getByRole('button', { name: 'Send' })).toBeDisabled();
    await input.press('Enter');
    await input.fill('   ');
    await input.press('Enter');
    await expect(dialog.getByRole('button', { name: 'Send' })).toBeDisabled();
    await page.waitForTimeout(300);
    expect(calls).toBe(0);
    await expect(log.getByText(ANSWER)).toHaveCount(0);
  });
});

test.describe('chat limits, errors, retry, long chat and Stop', { tag: SPEC_TAGS }, () => {
  const ANSWER = 'We build fast Next.js websites for startups.';
  const dlg = (page: import('@playwright/test').Page) => page.getByRole('dialog');
  const log = (page: import('@playwright/test').Page) =>
    dlg(page).getByRole('log', { name: 'Web41 assistant' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await launcher(page).click();
    await expect(dlg(page)).toBeVisible();
  });

  test('429 shows the limit notice with an email link and disables the composer', async ({
    page,
  }) => {
    await page.route('**/api/chat', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'rate_limited', reason: 'burst' }),
      }),
    );
    const input = dlg(page).getByLabel('Message');
    await input.fill('Hello');
    await input.press('Enter');

    const notice = dlg(page)
      .getByRole('status')
      .filter({ hasText: "You've hit the message limit" });
    await expect(notice).toBeVisible();
    await expect(notice.getByRole('link')).toHaveAttribute('href', /^mailto:.+@.+/);
    await expect(dlg(page).getByRole('alert')).toHaveCount(0);
    await expect(input).toBeDisabled();
    await expect(dlg(page).getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  test('502 shows the error bubble and Try again resends without duplicating', async ({ page }) => {
    const bodies: { messages: { role: string; content: string }[] }[] = [];
    let ok = false;
    await page.route('**/api/chat', (route) => {
      bodies.push(route.request().postDataJSON());
      return ok
        ? route.fulfill({ status: 200, contentType: 'text/plain', body: ANSWER })
        : route.fulfill({ status: 502, contentType: 'application/json', body: '{}' });
    });
    const input = dlg(page).getByLabel('Message');
    await input.fill('Need a quote');
    await input.press('Enter');

    const alert = dlg(page).getByRole('alert');
    await expect(alert).toContainText('Sorry, something went wrong. Try again or email us at');
    await expect(alert.getByRole('link')).toHaveAttribute('href', /^mailto:/);

    ok = true;
    await alert.getByRole('button', { name: 'Try again' }).click();
    await expect(log(page).getByText(ANSWER)).toBeVisible();
    await expect(dlg(page).getByRole('alert')).toHaveCount(0);
    await expect(log(page).getByText('Need a quote', { exact: true })).toHaveCount(1);
    expect(bodies).toHaveLength(2);
    expect(bodies[1].messages.filter((m) => m.role === 'user').at(-1)?.content).toBe(
      'Need a quote',
    );
    expect(bodies[1].messages).toHaveLength(1);
  });

  test('long chat note at 20 messages; Start over restores the composer', async ({ page }) => {
    await page.route('**/api/chat', (route) =>
      route.fulfill({ status: 200, contentType: 'text/plain', body: ANSWER }),
    );
    const input = dlg(page).getByLabel('Message');
    for (let i = 1; i <= 10; i++) {
      await expect(input).toBeEnabled();
      await input.fill(`Question ${i}`);
      await input.press('Enter');
      await expect(log(page).getByText(ANSWER)).toHaveCount(i);
    }
    await expect(
      dlg(page).getByText(
        "This chat is getting long. Start a new one, or get a free quote and we'll answer in detail.",
      ),
    ).toBeVisible();
    await expect(dlg(page).getByRole('link', { name: 'Get a free quote' })).toBeVisible();
    await expect(input).toBeDisabled();

    await dlg(page).getByText('Start over', { exact: true }).click();
    await expect(log(page).getByText(ANSWER)).toHaveCount(0);
    await expect(dlg(page).getByText('This chat is getting long')).toHaveCount(0);
    await expect(input).toBeEnabled();
  });

  test('Stop keeps the partial text and returns the Send button', async ({ page }) => {
    await page.evaluate(() => {
      window.fetch = (_url, init) => {
        const signal = init?.signal;
        const enc = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(enc.encode('Partial answer'));
            signal?.addEventListener('abort', () =>
              controller.error(new DOMException('Aborted', 'AbortError')),
            );
          },
        });
        return Promise.resolve(new Response(stream, { status: 200 }));
      };
    });
    const input = dlg(page).getByLabel('Message');
    await input.fill('Tell me more');
    await input.press('Enter');

    await expect(log(page).getByText('Partial answer')).toBeVisible();
    await dlg(page).getByRole('button', { name: 'Stop' }).click();
    await expect(dlg(page).getByRole('button', { name: 'Send' })).toBeVisible();
    await expect(log(page).getByText('Partial answer')).toBeVisible();
    await expect(dlg(page).getByRole('alert')).toHaveCount(0);
    await expect(input).toBeEnabled();
  });
});

test.describe('chat handoff card', { tag: SPEC_TAGS }, () => {
  const dlg = (page: import('@playwright/test').Page) => page.getByRole('dialog');
  const log = (page: import('@playwright/test').Page) =>
    dlg(page).getByRole('log', { name: 'Web41 assistant' });
  const openChat = async (page: import('@playwright/test').Page, path: string) => {
    await page.goto(path);
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await launcher(page).click();
    await expect(dlg(page)).toBeVisible();
  };
  const ask = async (page: import('@playwright/test').Page, text: string) => {
    const input = dlg(page).getByLabel('Message');
    await input.fill(text);
    await input.press('Enter');
  };
  const mockAnswer = (page: import('@playwright/test').Page, body: string) =>
    page.route('**/api/chat', (route) =>
      route.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body }),
    );

  test('on / the card closes the chat and scrolls to #lets-talk', async ({ page }) => {
    await openChat(page, '/');
    await mockAnswer(page, 'Landing pages start from $100.[[HANDOFF]]');
    await ask(page, 'How much is a landing page?');

    await expect(log(page).getByText('Landing pages start from $100.')).toBeVisible();
    const cta = dlg(page).getByRole('link', { name: 'Get a free quote' });
    await expect(cta).toBeVisible();
    await expect(page.getByText('[[HANDOFF]]')).toHaveCount(0);
    expect(await page.locator('body').innerText()).not.toContain('HANDOFF');

    await cta.click();
    await expect(dlg(page)).toHaveCount(0);
    await expect(page).toHaveURL(/#lets-talk$/);
    await expect(page.locator('#lets-talk')).toBeInViewport();
    await expect(page.locator('section#lets-talk')).toBeFocused();
    await expect(launcher(page)).not.toBeFocused();
  });

  test('on /portfolio the card navigates to /#lets-talk', async ({ page }) => {
    await openChat(page, '/portfolio');
    await mockAnswer(page, 'Landing pages start from $100.[[HANDOFF]]');
    await ask(page, 'How much is a landing page?');

    const cta = dlg(page).getByRole('link', { name: 'Get a free quote' });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect(page).toHaveURL(/\/#lets-talk$/);
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(dlg(page)).toHaveCount(0);
    await expect(page.locator('#lets-talk')).toBeInViewport({ timeout: 10_000 });
  });

  test('a general answer shows no card', async ({ page }) => {
    await openChat(page, '/');
    await mockAnswer(page, 'UI/UX design shapes how a product looks and feels.');
    await ask(page, 'What is UI/UX design?');

    await expect(log(page).getByText('UI/UX design shapes how a product')).toBeVisible();
    await expect(dlg(page).getByText('Want an exact quote?')).toHaveCount(0);
    await expect(dlg(page).getByRole('link', { name: 'Get a free quote' })).toHaveCount(0);
  });

  test('a token split across chunks is never visible', async ({ page }) => {
    await openChat(page, '/');
    await page.evaluate(() => {
      window.fetch = () => {
        const enc = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            controller.enqueue(enc.encode('Sure![[HAN'));
            await new Promise((r) => setTimeout(r, 1200));
            controller.enqueue(enc.encode('DOFF]]'));
            controller.close();
          },
        });
        return Promise.resolve(new Response(stream, { status: 200 }));
      };
    });
    await ask(page, 'How long does it take?');

    await expect(log(page).getByText('Sure!')).toBeVisible();
    const during = await page.locator('body').innerText();
    expect(during).not.toContain('[[');
    expect(during).not.toContain('HAN');
    await expect(dlg(page).getByRole('link', { name: 'Get a free quote' })).toBeVisible();
    const after = await page.locator('body').innerText();
    expect(after).not.toContain('[[');
    expect(after).not.toContain('HANDOFF');
  });
});

test.describe('chat persistence, suggestions, Start over and teaser', { tag: SPEC_TAGS }, () => {
  const ANSWER = 'We build fast Next.js websites for startups.';
  const GREETING = 'Hi! I can help with services, pricing, timelines and how we work.';
  const PILLS = [
    'How much is a landing page?',
    'How long does a site take?',
    'Webflow or custom code?',
  ];
  const TEASER = 'Questions about your website? Ask me.';
  type P = import('@playwright/test').Page;
  const dlg = (page: P) => page.getByRole('dialog');
  const log = (page: import('@playwright/test').Page) =>
    dlg(page).getByRole('log', { name: 'Web41 assistant' });
  const mock = (page: P) =>
    page.route('**/api/chat', (route) =>
      route.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: ANSWER }),
    );
  const open = async (page: P, path = '/') => {
    await page.goto(path);
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await launcher(page).click();
    await expect(dlg(page)).toBeVisible();
  };
  const ask = async (page: P, text: string) => {
    const input = dlg(page).getByLabel('Message');
    await input.fill(text);
    await input.press('Enter');
    await expect(log(page).getByText(ANSWER)).toBeVisible();
    await expect(dlg(page).getByRole('button', { name: 'Send' })).toBeDisabled();
  };
  const startOverBtn = (page: P) => dlg(page).locator('button[aria-label="Start over"]');
  const expectEmpty = async (page: P) => {
    await expect(log(page).getByText(GREETING)).toBeVisible();
    for (const pill of PILLS)
      await expect(log(page).getByText(pill, { exact: true })).toBeVisible();
    await expect(log(page).getByText(ANSWER)).toHaveCount(0);
    await expect(startOverBtn(page)).toBeDisabled();
  };

  test('suggestion click sends it and hides the pills', async ({ page }) => {
    const bodies: { messages: { role: string; content: string }[] }[] = [];
    await page.route('**/api/chat', (route) => {
      bodies.push(route.request().postDataJSON());
      return route.fulfill({ status: 200, contentType: 'text/plain', body: ANSWER });
    });
    await open(page);
    await expectEmpty(page);

    await log(page).getByText(PILLS[0], { exact: true }).click();
    await expect(log(page).getByText(ANSWER)).toBeVisible();
    expect(bodies).toHaveLength(1);
    expect(bodies[0].messages.filter((m) => m.role === 'user').at(-1)?.content).toBe(PILLS[0]);
    await expect(log(page).getByText(PILLS[0], { exact: true })).toHaveCount(1);
    await expect(log(page).getByText(PILLS[1], { exact: true })).toHaveCount(0);
    await expect(log(page).getByText(GREETING)).toHaveCount(0);
  });

  test('reopening the panel keeps the messages', async ({ page }) => {
    await mock(page);
    await open(page);
    await ask(page, 'What do you build?');
    await launcher(page).click();
    await expect(dlg(page)).toHaveCount(0);
    await launcher(page).click();
    await expect(log(page).getByText('What do you build?', { exact: true })).toBeVisible();
    await expect(log(page).getByText(ANSWER)).toBeVisible();
  });

  test('conversation survives client navigation and a full page load', async ({ page }) => {
    await mock(page);
    await open(page);
    await ask(page, 'What do you build?');
    await launcher(page).click();
    await expect(dlg(page)).toHaveCount(0);

    await page.locator('a[href="/portfolio"]:visible').first().click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(launcher(page)).toBeVisible();
    await launcher(page).click();
    await expect(log(page).getByText('What do you build?', { exact: true })).toBeVisible();
    await expect(log(page).getByText(ANSWER)).toBeVisible();

    await page.goto('/portfolio');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await launcher(page).click();
    await expect(log(page).getByText('What do you build?', { exact: true })).toBeVisible();
    await expect(log(page).getByText(ANSWER)).toBeVisible();
  });

  test('a new tab starts with only the greeting and suggestions', async ({ page, context }) => {
    await mock(page);
    await open(page);
    await ask(page, 'What do you build?');
    const stored = await page.evaluate(() => sessionStorage.getItem('web41.chat.v1.messages'));
    expect(stored).toContain('What do you build?');

    const second = await context.newPage();
    await open(second);
    await expectEmpty(second);
    await second.close();
  });

  test('Start over restores greeting and suggestions, and stays empty after reload', async ({
    page,
  }) => {
    await mock(page);
    await open(page);
    await ask(page, 'What do you build?');
    await expect(startOverBtn(page)).toBeEnabled();
    await startOverBtn(page).click();
    await expect(log(page).getByText('What do you build?', { exact: true })).toHaveCount(0);
    await expectEmpty(page);

    await page.reload();
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await launcher(page).click();
    await expectEmpty(page);
  });

  test('teaser appears after 20 s on /, opens the chat on click', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await page.clock.runFor(19_000);
    await expect(page.getByText(TEASER)).toHaveCount(0);
    await page.clock.runFor(2_000);
    const teaser = page.getByText(TEASER);
    await expect(teaser).toBeVisible();
    const t = await teaser.boundingBox();
    const l = await launcher(page).boundingBox();
    expect(t!.y + t!.height).toBeLessThanOrEqual(l!.y + 1);

    await teaser.click();
    await expect(dlg(page)).toBeVisible();
    await expect(page.getByText(TEASER)).toHaveCount(0);
  });

  test('dismissed teaser does not come back after navigating', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await page.clock.runFor(21_000);
    await expect(page.getByText(TEASER)).toBeVisible();
    await page.getByRole('button', { name: 'Dismiss' }).click();
    await expect(page.getByText(TEASER)).toHaveCount(0);

    await page.locator('a[href="/portfolio"]:visible').first().click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await page.clock.runFor(25_000);
    await expect(page.getByText(TEASER)).toHaveCount(0);
  });

  test('no teaser on /privacy-policy', async ({ page }) => {
    await page.clock.install();
    await page.goto('/privacy-policy');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await page.clock.runFor(25_000);
    await expect(page.getByText(TEASER)).toHaveCount(0);
  });
});

test.describe('chat mobile, keyboard, reduced motion and print', { tag: SPEC_TAGS }, () => {
  type P = import('@playwright/test').Page;
  const dlg = (page: P) => page.getByRole('dialog');
  const log = (page: P) => dlg(page).getByRole('log', { name: 'Web41 assistant' });
  const MOBILE = { width: 375, height: 812 };
  const goHome = async (page: P) => {
    await page.goto('/');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
  };
  const activeIsLauncher = (page: P) =>
    page.evaluate(
      () => document.activeElement === document.querySelector('button[aria-controls="chat-panel"]'),
    );
  const focusInDialog = (page: P) =>
    page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));

  test('375 px: full-screen modal panel, 44 px close button, scroll lock restored', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE);
    await goHome(page);
    await launcher(page).click();
    await expect(dlg(page)).toBeVisible();
    await expect(dlg(page)).toHaveAttribute('aria-modal', 'true');
    await expect.poll(async () => (await dlg(page).boundingBox())?.y).toBe(0); // entrance animation settled
    const box = await dlg(page).boundingBox();
    expect(box!.x).toBe(0);
    expect(box!.width).toBe(375);
    expect(Math.abs(box!.height - 812)).toBeLessThanOrEqual(1);

    const close = dlg(page).getByRole('button', { name: 'Close chat' });
    await expect(close).toBeVisible();
    const cb = await close.boundingBox();
    expect(cb!.width).toBeGreaterThanOrEqual(44);
    expect(cb!.height).toBeGreaterThanOrEqual(44);
    expect(cb!.y).toBeLessThan(80);

    const overflow = () =>
      page.evaluate(() => [
        getComputedStyle(document.documentElement).overflow,
        getComputedStyle(document.body).overflow,
      ]);
    expect((await overflow()).includes('hidden')).toBe(true);
    await close.click();
    await expect(dlg(page)).toHaveCount(0);
    expect((await overflow()).includes('hidden')).toBe(false);
  });

  test('375 px: launcher never overlaps the header free quote button or lets-talk fields', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE);
    await goHome(page);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const hits: string[] = [];
    let fields = 0;
    for (let y = 0; y <= total; y += 300) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(60);
      const res = await page.evaluate((top) => {
        const l = document
          .querySelector('button[aria-controls="chat-panel"]')!
          .getBoundingClientRect();
        const hit = (el: Element) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden') return false;
          return r.left < l.right && r.right > l.left && r.top < l.bottom && r.bottom > l.top;
        };
        const lt = [...document.querySelectorAll('#lets-talk input, #lets-talk textarea')];
        const quote = [...document.querySelectorAll('header a, header button')].filter((e) =>
          /free quote/i.test(e.textContent ?? ''),
        );
        return {
          fields: lt.length,
          hits: [...lt, ...quote]
            .filter(hit)
            .map((e) => `scrollY=${top} ${e.tagName} ${e.id} ${(e.textContent ?? '').trim()}`),
        };
      }, y);
      fields = res.fields;
      hits.push(...res.hits);
    }
    expect(fields).toBeGreaterThan(0);
    expect(hits).toEqual([]);
  });

  for (const [name, size] of [
    ['desktop', { width: 1280, height: 800 }],
    ['375 px', MOBILE],
  ] as const) {
    test(`keyboard (${name}): Enter opens, composer focused, Escape returns focus to launcher`, async ({
      page,
    }) => {
      await page.setViewportSize(size);
      await goHome(page);
      await launcher(page).focus();
      await page.keyboard.press('Enter');
      await expect(dlg(page)).toBeVisible();
      await expect(dlg(page).getByLabel('Message')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dlg(page)).toHaveCount(0);
      await expect(launcher(page)).toBeVisible();
      expect(await activeIsLauncher(page)).toBe(true);
    });
  }

  test('375 px: Tab keeps focus inside the dialog', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await goHome(page);
    await launcher(page).click();
    await expect(dlg(page)).toBeVisible();
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      expect(await focusInDialog(page)).toBe(true);
    }
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Shift+Tab');
      expect(await focusInDialog(page)).toBe(true);
    }
  });

  test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('panel shows at full opacity with no transform or animations; dots do not animate', async ({
      page,
    }) => {
      await page.setViewportSize(MOBILE);
      await goHome(page);
      await page.route('**/api/chat', async (route) => {
        await new Promise((r) => setTimeout(r, 1500));
        await route.fulfill({ status: 200, contentType: 'text/plain', body: 'Done.' });
      });
      await page.evaluate(() => {
        const w = window as unknown as { __frames: string[] };
        w.__frames = [];
        const sample = () => {
          const el = document.getElementById('chat-panel');
          if (el) {
            const cs = getComputedStyle(el);
            w.__frames.push(`${cs.opacity}|${cs.transform}`);
          }
          requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      await launcher(page).click();
      await expect(dlg(page)).toBeVisible();
      await page.waitForTimeout(150);
      const frames = await page.evaluate(
        () => (window as unknown as { __frames: string[] }).__frames,
      );
      expect(frames.length).toBeGreaterThan(0);
      for (const f of frames) {
        const [opacity, transform] = f.split('|');
        expect(opacity).toBe('1');
        expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
      }
      const running = await page.evaluate(
        () => document.getElementById('chat-panel')!.getAnimations().length,
      );
      expect(running).toBe(0);

      const input = dlg(page).getByLabel('Message');
      await input.fill('hi');
      await input.press('Enter');
      const dots = dlg(page).locator('div[aria-hidden="true"] span.rounded-full');
      await expect(dots).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        expect(await dots.nth(i).evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
      }
      await expect(log(page).getByText('Done.')).toBeVisible();
    });
  });

  test('print media hides the launcher, the open panel and the teaser', async ({ page }) => {
    await page.clock.install();
    await page.setViewportSize(MOBILE);
    await goHome(page);
    await page.clock.runFor(21_000);
    const teaser = page.getByText('Questions about your website? Ask me.');
    await expect(teaser).toBeVisible();
    const display = (sel: string) =>
      page.evaluate((s) => {
        const el = document.querySelector(s);
        return el ? getComputedStyle(el).display : 'missing';
      }, sel);
    await page.emulateMedia({ media: 'print' });
    await expect(teaser).toBeHidden();
    expect(await display('button[aria-controls="chat-panel"]')).toBe('none');
    await page.emulateMedia({ media: 'screen' });
    await launcher(page).click();
    await expect(dlg(page)).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    await expect(dlg(page)).toBeHidden();
    expect(await display('#chat-panel')).toBe('none');
  });
});

type AcPage = import('@playwright/test').Page;
const acDlg = (page: AcPage) => page.getByRole('dialog');
const acLog = (page: AcPage) => acDlg(page).getByRole('log', { name: 'Web41 assistant' });
const acOpen = async (page: AcPage, path = '/') => {
  await page.goto(path);
  await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
  await launcher(page).click();
  await expect(acDlg(page)).toBeVisible();
};
const acMock = (page: AcPage, body: string) =>
  page.route('**/api/chat', (route) =>
    route.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body }),
  );
const acAsk = async (page: AcPage, text: string) => {
  const input = acDlg(page).getByLabel('Message');
  await input.fill(text);
  await input.press('Enter');
};
const ACCENT = 'rgb(219, 255, 4)';

test.describe('acceptance: launcher placement and desktop panel', { tag: SPEC_TAGS }, () => {
  for (const path of ['/', '/portfolio', '/services', '/contacts', '/about-us']) {
    test(`FS 2.1: round accent launcher sits bottom-right on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
      const vp = page.viewportSize()!;
      const box = (await launcher(page).boundingBox())!;
      expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
      expect(vp.width - (box.x + box.width)).toBeLessThanOrEqual(32);
      expect(vp.height - (box.y + box.height)).toBeLessThanOrEqual(32);
      const style = await launcher(page).evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, radius: parseFloat(cs.borderTopLeftRadius) };
      });
      expect(style.bg).toBe(ACCENT);
      expect(style.radius).toBeGreaterThanOrEqual(box.width / 2);
    });
  }

  test('FS 2.1: desktop panel opens above the bottom-right corner, launcher shows a cross', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await acOpen(page);
    await expect.poll(async () => (await acDlg(page).boundingBox())?.width).toBe(380);
    await page.waitForTimeout(300); // entrance animation settled
    const panel = (await acDlg(page).boundingBox())!;
    const btn = (await launcher(page).boundingBox())!;
    expect(panel.y + panel.height).toBeLessThanOrEqual(btn.y + 1);
    expect(1280 - (panel.x + panel.width)).toBeLessThanOrEqual(32);
    const iconId = () =>
      launcher(page)
        .locator('use')
        .evaluate((e) => e.getAttribute('xlink:href') ?? e.getAttribute('href'));
    expect(await iconId()).toMatch(/icon-cross/);
    await launcher(page).click();
    expect(await iconId()).toMatch(/icon-chat/);
  });
});

test.describe('acceptance: teaser on terms-of-use', { tag: SPEC_TAGS }, () => {
  test('FS 2.1: no teaser on /terms-of-use after 20 s', async ({ page }) => {
    await page.clock.install();
    await page.goto('/terms-of-use');
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await page.clock.runFor(25_000);
    await expect(page.getByText('Questions about your website? Ask me.')).toHaveCount(0);
  });
});

test.describe('acceptance: panel content and composer', { tag: SPEC_TAGS }, () => {
  test('FS 2.2: first open shows header, greeting and three suggestions', async ({ page }) => {
    await acOpen(page);
    await expect(acDlg(page).getByText('Web41 assistant', { exact: true })).toBeVisible();
    await expect(acDlg(page).getByText('AI · usually replies in seconds')).toBeVisible();
    await expect(
      acLog(page).getByText('Hi! I can help with services, pricing, timelines and how we work.'),
    ).toBeVisible();
    for (const pill of [
      'How much is a landing page?',
      'How long does a site take?',
      'Webflow or custom code?',
    ])
      await expect(acLog(page).getByRole('button', { name: pill, exact: true })).toBeVisible();
    await expect(acLog(page).getByRole('button')).toHaveCount(3);
  });

  test('FS 2.2: "AI can make mistakes. Prefer a human? Email us" opens a mailto', async ({
    page,
  }) => {
    await acOpen(page);
    await expect(acDlg(page).getByText(/AI can make mistakes\. Prefer a human\?/)).toBeVisible();
    const link = acDlg(page).getByRole('link', { name: 'Email us' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /^mailto:[^@]+@[^@]+\.[^@]+$/);
  });
});

test.describe('acceptance: composer limits, bubbles and links', { tag: SPEC_TAGS }, () => {
  test('FS 2.3: counter appears at 400 characters and typing stops at 500', async ({ page }) => {
    await acOpen(page);
    const input = acDlg(page).getByLabel('Message');
    await input.fill('a'.repeat(399));
    await expect(acDlg(page).getByText(/\d+ \/ 500/)).toHaveCount(0);
    await input.pressSequentially('b');
    await expect(acDlg(page).getByText('400 / 500', { exact: true })).toBeVisible();
    await input.fill('c'.repeat(600));
    await expect(input).toHaveValue('c'.repeat(500));
    await expect(acDlg(page).getByText('500 / 500', { exact: true })).toBeVisible();
    await input.pressSequentially('d');
    await expect(input).toHaveValue('c'.repeat(500));
  });

  test('FS 2.3: user bubble is black on the right, assistant bubble is grey on the left', async ({
    page,
  }) => {
    await acMock(page, 'Typically two to four weeks.');
    await acOpen(page);
    await acAsk(page, 'How long does a landing page take?');
    const user = acLog(page).getByText('How long does a landing page take?', { exact: true });
    const bot = acLog(page).getByText('Typically two to four weeks.');
    await expect(bot).toBeVisible();
    const style = (loc: typeof user) =>
      loc.evaluate((el) => {
        const bubble = el.closest('div.rounded-2xl') ?? el;
        const cs = getComputedStyle(bubble);
        const log = el.closest('[role="log"]')!.getBoundingClientRect();
        const r = bubble.getBoundingClientRect();
        return {
          bg: cs.backgroundColor,
          color: cs.color,
          mid: (r.left + r.right) / 2 - (log.left + log.right) / 2,
        };
      });
    const u = await style(user);
    const b = await style(bot);
    expect(u.bg).toBe('rgb(0, 0, 0)');
    expect(u.color).toBe('rgb(255, 255, 255)');
    expect(u.mid).toBeGreaterThan(0);
    expect(b.bg).toBe('rgb(249, 249, 249)');
    expect(b.mid).toBeLessThan(0);
  });

  test('FS 2.3: first words show while the answer is still being written', async ({ page }) => {
    await acOpen(page);
    await page.evaluate(() => {
      window.fetch = () => {
        const enc = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            controller.enqueue(enc.encode('First words'));
            await new Promise((r) => setTimeout(r, 2500));
            controller.enqueue(enc.encode(' and the rest.'));
            controller.close();
          },
        });
        return Promise.resolve(new Response(stream, { status: 200 }));
      };
    });
    await acAsk(page, 'How long?');
    await expect(acLog(page).getByText('First words', { exact: true })).toBeVisible({
      timeout: 2000,
    });
    await expect(acDlg(page).getByRole('button', { name: 'Stop' })).toBeVisible();
    await expect(acLog(page).getByText('First words and the rest.')).toBeVisible();
  });

  test('FS 2.3: bold, bullets and underlined links render; internal link opens in the same tab, external in a new one', async ({
    page,
  }) => {
    await acMock(
      page,
      'We have **bold** news:\n- first point\n- second point\nSee the [Portfolio](/portfolio) or [Example](https://example.com/x).',
    );
    await acOpen(page);
    await acAsk(page, 'Show me your work');
    await expect(acLog(page).locator('strong', { hasText: 'bold' })).toBeVisible();
    await expect(acLog(page).locator('li')).toHaveCount(2);

    const external = acLog(page).getByRole('link', { name: 'Example' });
    await expect(external).toHaveAttribute('target', '_blank');
    await expect(external).toHaveAttribute('rel', /noopener/);
    expect(await external.evaluate((e) => getComputedStyle(e).textDecorationLine)).toContain(
      'underline',
    );

    const internal = acLog(page).getByRole('link', { name: 'Portfolio' });
    await expect(internal).toHaveAttribute('href', '/portfolio');
    await expect(internal).not.toHaveAttribute('target', /.+/);
    let popup = false;
    page.context().on('page', () => (popup = true));
    await internal.click();
    await expect(page).toHaveURL(/\/portfolio$/);
    expect(popup).toBe(false);
  });

  test('FS 2.4: a Ukrainian answer renders as written while chat labels stay English', async ({
    page,
  }) => {
    const reply = 'Лендінг коштує від $100.';
    await acMock(page, reply);
    await acOpen(page);
    await acAsk(page, 'Скільки коштує лендінг?');
    await expect(acLog(page).getByText(reply)).toBeVisible();
    await expect(acDlg(page).getByLabel('Message')).toBeVisible();
    await expect(acDlg(page).getByRole('button', { name: 'Send' })).toBeVisible();
    await expect(acDlg(page).getByRole('button', { name: 'Start over' })).toBeVisible();
    await expect(acDlg(page).getByRole('button', { name: 'Close chat' })).toBeVisible();
  });
});

test.describe('acceptance: handoff card layout', { tag: SPEC_TAGS }, () => {
  test('FS 2.5: the card is black, ends the priced answer and has an accent button', async ({
    page,
  }) => {
    await acMock(page, 'A Webflow site starts from $800.[[HANDOFF]]');
    await acOpen(page);
    await acAsk(page, 'How much is a Webflow site?');
    const answer = acLog(page).getByText('A Webflow site starts from $800.');
    const cta = acDlg(page).getByRole('link', { name: 'Get a free quote' });
    await expect(cta).toBeVisible();
    await expect(acDlg(page).getByText('Want an exact quote?')).toBeVisible();
    const card = acDlg(page).locator('div.rounded-2xl', { hasText: 'Want an exact quote?' }).last();
    expect(await card.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(0, 0, 0)');
    expect(await cta.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(ACCENT);
    const a = (await answer.boundingBox())!;
    const c = (await card.boundingBox())!;
    expect(c.y).toBeGreaterThanOrEqual(a.y + a.height - 1);
  });
});

test.describe('acceptance: touch targets and font size', { tag: SPEC_TAGS }, () => {
  test('FS 2.8: composer text is 16px and every control is at least 44x44 at 375 px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await acMock(page, 'Landing pages start from $100.[[HANDOFF]]');
    await acOpen(page);
    await page.waitForTimeout(300); // entrance animation settled
    const fontSize = await acDlg(page)
      .getByLabel('Message')
      .evaluate((e) => getComputedStyle(e).fontSize);
    expect(fontSize).toBe('16px');

    const undersized = () =>
      acDlg(page)
        .locator('button:visible, a:visible')
        .evaluateAll((els) =>
          els
            .map((e) => {
              const r = e.getBoundingClientRect();
              return {
                name: e.getAttribute('aria-label') ?? (e.textContent ?? '').trim(),
                w: Math.round(r.width),
                h: Math.round(r.height),
              };
            })
            .filter((c) => c.h < 44 || c.w < 44),
        );

    // Empty state: Start over, Close, three suggestions, Send, "Email us".
    expect(await acDlg(page).locator('button:visible, a:visible').count()).toBeGreaterThanOrEqual(
      6,
    );
    expect(await undersized()).toEqual([]);

    // After a priced answer: handoff card button and the rest.
    await acAsk(page, 'How much is a landing page?');
    await expect(acDlg(page).getByRole('link', { name: 'Get a free quote' })).toBeVisible();
    expect(await undersized()).toEqual([]);
  });
});

test.describe('acceptance: chat loads after page content', { tag: SPEC_TAGS }, () => {
  test('FS 2.9: server HTML has no chat button; the launcher and chunk arrive after first paint', async ({
    page,
  }) => {
    const html = await (await page.request.get('/')).text();
    expect(html).not.toContain('chat-panel');

    await page.addInitScript(() => {
      const w = window as unknown as { __launcherAt?: number };
      const check = () => {
        if (
          w.__launcherAt === undefined &&
          document.querySelector('button[aria-controls="chat-panel"]')
        )
          w.__launcherAt = performance.now();
      };
      new MutationObserver(check).observe(document, { childList: true, subtree: true });
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });

    const t = await page.evaluate(() => {
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
      const chunks = performance
        .getEntriesByType('resource')
        .filter((r) => /ChatWidget/i.test(r.name))
        .map((r) => r.startTime);
      return {
        fcp,
        launcherAt: (window as unknown as { __launcherAt?: number }).__launcherAt ?? 0,
        chunks,
      };
    });
    expect(t.fcp).toBeGreaterThan(0);
    expect(t.launcherAt).toBeGreaterThan(t.fcp);
    expect(t.chunks.length).toBeGreaterThan(0);
    for (const start of t.chunks) expect(start).toBeGreaterThan(t.fcp);
  });
});

test.describe('acceptance: page content does not wait for chat', { tag: SPEC_TAGS }, () => {
  test('FS 2.9: page content is visible while the chat chunk is still loading', async ({
    page,
  }) => {
    await page.route(/ChatWidget/, async (route) => {
      await new Promise((r) => setTimeout(r, 4000));
      await route.continue();
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(launcher(page)).toHaveCount(0);
    await expect(launcher(page)).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('acceptance: privacy policy chat section', { tag: SPEC_TAGS }, () => {
  test('FS 2.10: Chat assistant section names OpenAI and says conversations are not kept', async ({
    page,
  }) => {
    await page.goto('/privacy-policy');
    const heading = page.getByRole('heading', { name: 'Chat assistant', level: 2 });
    await expect(heading).toBeVisible();
    const section = page.locator('section[aria-labelledby]', { has: heading });
    await expect(section).toContainText('OpenAI');
    await expect(section).toContainText('We do not store chat conversations');
    await expect(section).toContainText('Once your visit ends, it is gone');
    await expect(section).toContainText(/do not share passwords, card numbers/i);
  });

  test('FS 2.10: "At a glance" mentions the chat next to the form and email', async ({ page }) => {
    await page.goto('/privacy-policy');
    const summary = page.locator('section[aria-labelledby="legal-summary-title"]');
    await expect(summary.getByRole('heading', { name: 'At a glance' })).toBeVisible();
    const point = summary.getByText(/only collect what you send us/i);
    await expect(point).toContainText(/form/i);
    await expect(point).toContainText(/chat/i);
    await expect(point).toContainText(/email/i);
  });
});

const UK_TAGS = ['@spec:005-multilingual-site-ukrainian', '@regression'];

test.describe('chat in Ukrainian', { tag: UK_TAGS }, () => {
  const ukLog = (page: AcPage) => acDlg(page).getByRole('log', { name: 'Асистент Web41' });
  const ukInput = (page: AcPage) => acDlg(page).getByLabel('Повідомлення');
  const ukOpen = async (page: AcPage, path: string) => {
    await page.goto(path);
    await expect(launcher(page)).toBeVisible({ timeout: 15_000 });
    await expect(launcher(page)).toHaveAccessibleName('Відкрити чат');
    await launcher(page).click();
    await expect(acDlg(page)).toBeVisible();
  };

  test('on a uk page the greeting and suggestions are Ukrainian', async ({ page }) => {
    await ukOpen(page, '/uk/services');
    await expect(acDlg(page).getByText('Привіт! Я допоможу з послугами')).toBeVisible();
    for (const text of [
      'Скільки коштує лендінг?',
      'Скільки часу займає створення сайту?',
      'Webflow чи власний код?',
    ]) {
      await expect(acDlg(page).getByRole('button', { name: text })).toBeVisible();
    }
    await expect(ukInput(page)).toBeVisible();
    await expect(acDlg(page).getByText('Hi!')).toHaveCount(0);
    await expect(acDlg(page).getByRole('button', { name: 'Send' })).toHaveCount(0);
  });

  test('the request body carries locale uk on /uk and en on English pages', async ({ page }) => {
    const bodies: { locale?: string }[] = [];
    await page.route('**/api/chat', (route) => {
      bodies.push(route.request().postDataJSON());
      return route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: 'Лендінг від $100.',
      });
    });
    await ukOpen(page, '/uk');
    await acDlg(page).getByRole('button', { name: 'Скільки коштує лендінг?' }).click();
    await expect(ukLog(page).getByText('Лендінг від $100.')).toBeVisible();
    expect(bodies).toHaveLength(1);
    expect(bodies[0].locale).toBe('uk');

    await page.evaluate(() => sessionStorage.clear());
    await acOpen(page, '/');
    await acAsk(page, 'How much?');
    await expect.poll(() => bodies.length).toBe(2);
    expect(bodies[1].locale).toBe('en');
  });

  test('the handoff card takes a uk visitor to /uk#lets-talk', async ({ page }) => {
    await ukOpen(page, '/uk/portfolio');
    await acMock(page, 'Лендінг від $100.[[HANDOFF]]');
    await ukInput(page).fill('Скільки коштує лендінг?');
    await ukInput(page).press('Enter');
    const cta = acDlg(page).getByRole('link', { name: 'Отримати безкоштовну оцінку' });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/uk#lets-talk');
    await expect(page.getByText('[[HANDOFF]]')).toHaveCount(0);

    await cta.click();
    await expect(page).toHaveURL(/\/uk#lets-talk$/);
    expect(new URL(page.url()).pathname).toBe('/uk');
    await expect(acDlg(page)).toHaveCount(0);
    await expect(page.locator('#lets-talk')).toBeInViewport({ timeout: 10_000 });
  });

  test('an English conversation survives a switch to UA and the UI turns Ukrainian', async ({
    page,
  }) => {
    await acOpen(page, '/services');
    await acMock(page, 'We build fast websites.');
    await acAsk(page, 'What do you build?');
    await expect(acLog(page).getByText('We build fast websites.')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(acDlg(page)).toHaveCount(0);
    await page
      .getByRole('group', { name: 'Language selection' })
      .getByRole('link', { name: 'Українська' })
      .click();
    await expect(page).toHaveURL(/\/uk\/services$/);

    await expect(launcher(page)).toHaveAccessibleName('Відкрити чат');
    await launcher(page).click();
    await expect(acDlg(page)).toBeVisible();
    await expect(ukLog(page).getByText('What do you build?')).toBeVisible();
    await expect(ukLog(page).getByText('We build fast websites.')).toBeVisible();
    await expect(ukInput(page)).toBeVisible();
    await expect(acDlg(page).getByRole('button', { name: 'Почати заново' })).toBeVisible();
  });
});
