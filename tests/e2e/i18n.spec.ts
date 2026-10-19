import { expect, type Page, test } from '@playwright/test';

import { legalDocuments } from '@/content/legal';

/*
 * @spec: 005-multilingual-site-ukrainian - acceptance traceability (functional-spec.md AC -> describe).
 * Filter: --grep @spec:005-multilingual-site-ukrainian
 *
 * 2.1 EN URLs unchanged, /uk renders uk ... 'URLs and rendering'
 * 2.2 switcher (desktop, mobile, a11y) .... 'language switcher', 'language switcher on mobile'
 * 2.3 first-visit language ................ 'first visit language'
 * 2.4 internal links stay in uk, legal ..... 'translated content'
 * 2.8 uk 404 ............................... 'uk not found'
 * MANUAL: "no English sentences" on every uk page (needs a human proofreader), social-preview rendering,
 *         Google URL Inspection (real crawler). Metadata values are covered in src/i18n/i18n.test.ts.
 */
const SPEC_TAGS = ['@spec:005-multilingual-site-ukrainian', '@regression'];

test.describe.configure({ timeout: 120_000 });

const switcher = (page: Page) => page.getByRole('group', { name: 'Language selection' });
const ukSwitcher = (page: Page) => page.getByRole('group', { name: 'Вибір мови' });
const toUk = (page: Page) => switcher(page).getByRole('link', { name: 'Українська' });
const toEn = (page: Page) => ukSwitcher(page).getByRole('link', { name: 'English' });

const htmlLang = (page: Page) => page.locator('html').getAttribute('lang');

test.describe('URLs and rendering', { tag: SPEC_TAGS }, () => {
  test('every English address from the sitemap answers 200 with no redirect', async ({
    request,
  }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .filter((p) => p !== '/uk' && !p.startsWith('/uk/'));
    expect(paths).toHaveLength(20);
    expect(paths).toContain('/');
    expect(paths).toContain('/portfolio/calmisu');

    for (const path of paths) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(200);
    }
  });

  test('the sitemap lists every page in both languages', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(paths).toHaveLength(40);
    for (const p of paths.filter((x) => !x.startsWith('/uk'))) {
      expect(paths).toContain(p === '/' ? '/uk' : `/uk${p}`);
    }
    expect(xml).toContain('hreflang="uk"');
    expect(xml).toContain('hreflang="x-default"');
  });

  test('/services stays English with html lang en', async ({ page }) => {
    const res = await page.goto('/services');
    expect(res?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe('/services');
    expect(await htmlLang(page)).toBe('en');
    await expect(page.getByRole('link', { name: 'Get a free quote' }).first()).toBeVisible();
  });

  test('/uk/services renders Ukrainian with lang, title and the hreflang pair', async ({
    page,
  }) => {
    const res = await page.goto('/uk/services');
    expect(res?.status()).toBe(200);
    expect(await htmlLang(page)).toBe('uk');
    await expect(page).toHaveTitle(/Послуги/);
    await expect(
      page.getByRole('link', { name: 'Отримати безкоштовну оцінку' }).first(),
    ).toBeVisible();

    const alt = (hreflang: string) =>
      page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`).getAttribute('href');
    expect(await alt('uk')).toMatch(/\/uk\/services$/);
    expect(await alt('en')).toMatch(/\/services$/);
    expect(await alt('en')).not.toContain('/uk/');
    expect(await alt('x-default')).toBe(await alt('en'));
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(
      /\/uk\/services$/,
    );
    expect(await page.locator('meta[property="og:locale"]').getAttribute('content')).toBe('uk_UA');
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toMatch(
      /Послуги/,
    );
  });

  test('a Ukrainian address opened in a fresh browser context is still Ukrainian', async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();
    await page.goto('/uk/portfolio/calmisu');
    expect(new URL(page.url()).pathname).toBe('/uk/portfolio/calmisu');
    expect(await htmlLang(page)).toBe('uk');
    await context.close();
  });

  test('direct links are never redirected, whatever the browser language', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'uk-UA' });
    const page = await context.newPage();
    await page.goto('/services');
    expect(new URL(page.url()).pathname).toBe('/services');
    expect(await htmlLang(page)).toBe('en');
    await context.close();

    const enContext = await browser.newContext({ locale: 'en-US' });
    const enPage = await enContext.newPage();
    await enPage.goto('/uk/services');
    expect(new URL(enPage.url()).pathname).toBe('/uk/services');
    await enContext.close();
  });
});

test.describe('language switcher', { tag: SPEC_TAGS }, () => {
  test('exposes a group label, endonyms and aria-current on the active option', async ({
    page,
  }) => {
    await page.goto('/services');
    await expect(switcher(page)).toBeVisible();
    await expect(switcher(page).getByText('EN', { exact: true })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(switcher(page).getByText('EN', { exact: true })).toHaveAccessibleName('English');
    const ua = toUk(page);
    await expect(ua).toHaveText('UK');
    await expect(ua).toHaveAttribute('lang', 'uk');
    await expect(ua).not.toHaveAttribute('aria-current', /.*/);

    await page.goto('/uk/services');
    await expect(ukSwitcher(page)).toBeVisible();
    await expect(ukSwitcher(page).getByText('UK', { exact: true })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(toEn(page)).toHaveAccessibleName('English');
  });

  test('the active option is on the accent background, the other one is plain', async ({
    page,
  }) => {
    await page.goto('/services');
    const bg = (loc: ReturnType<Page['locator']>) =>
      loc.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(await bg(switcher(page).getByText('EN', { exact: true }))).toBe('rgb(219, 255, 4)');
    expect(await bg(toUk(page))).toBe('rgba(0, 0, 0, 0)');
  });

  test('EN -> UA keeps the Services page and lands at the top', async ({ page }) => {
    await page.goto('/services');
    await page.evaluate(() => window.scrollTo(0, 600));
    await toUk(page).click();
    await expect(page).toHaveURL(/\/uk\/services$/);
    expect(await htmlLang(page)).toBe('uk');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });

  test('UA -> EN keeps a case study page', async ({ page }) => {
    await page.goto('/uk/portfolio/calmisu');
    await toEn(page).click();
    await expect(page).toHaveURL((url) => url.pathname === '/portfolio/calmisu');
    expect(new URL(page.url()).pathname).toBe('/portfolio/calmisu');
    expect(await htmlLang(page)).toBe('en');
  });

  test('the choice is remembered: / stays English after switching to EN', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'uk-UA' });
    const page = await context.newPage();
    await page.goto('/uk');
    await toEn(page).click();
    await expect(page).toHaveURL((url) => !url.pathname.startsWith('/uk'));
    await page.goto('/');
    expect(new URL(page.url()).pathname).toBe('/');
    expect(await htmlLang(page)).toBe('en');
    await context.close();
  });

  test('choosing the active language is a no-op without a reload', async ({ page }) => {
    await page.goto('/uk/services');
    await page.evaluate(() => {
      (window as unknown as { __marker: number }).__marker = 1;
    });
    const active = ukSwitcher(page).getByText('UK', { exact: true });
    await expect(ukSwitcher(page).getByRole('link', { name: 'Українська' })).toHaveCount(0);
    await active.click();
    expect(new URL(page.url()).pathname).toBe('/uk/services');
    expect(await page.evaluate(() => (window as unknown as { __marker?: number }).__marker)).toBe(
      1,
    );
  });

  test('keyboard: Tab reaches the option with a visible outline and Enter switches', async ({
    page,
  }) => {
    await page.goto('/services');
    const ua = toUk(page);
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab');
      if (await ua.evaluate((el) => el === document.activeElement)) break;
    }
    await expect(ua).toBeFocused();
    const outline = await ua.evaluate((el) => {
      const s = getComputedStyle(el);
      return { width: s.outlineWidth, style: s.outlineStyle };
    });
    expect(outline.style).not.toBe('none');
    expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/uk\/services$/);
    expect(await htmlLang(page)).toBe('uk');
  });
});

test.describe('language switcher on mobile', { tag: SPEC_TAGS }, () => {
  test.use({ viewport: { width: 375, height: 700 } });

  test('English | Українська sits above Free Quote in the menu and switches', async ({ page }) => {
    await page.goto('/services');
    await expect(switcher(page)).toBeHidden();
    await page.getByRole('button', { name: 'Open menu' }).click();
    const group = switcher(page);
    await expect(group).toBeVisible();
    await expect(group.getByText('English', { exact: true })).toBeVisible();
    await expect(group.getByRole('link', { name: 'Українська' })).toHaveText('Українська');

    const menu = page.locator('#mobile-menu');
    const groupBox = (await group.boundingBox())!;
    const quoteBox = (await menu.getByRole('link', { name: 'Get a free quote' }).boundingBox())!;
    expect(groupBox.y + groupBox.height).toBeLessThanOrEqual(quoteBox.y);
    expect(groupBox.width).toBeGreaterThan(250);

    await group.getByRole('link', { name: 'Українська' }).click();
    await expect(page).toHaveURL(/\/uk\/services$/);
    expect(await htmlLang(page)).toBe('uk');
  });
});

test.describe('first visit language', { tag: SPEC_TAGS }, () => {
  test.describe('Ukrainian browser', () => {
    test.use({ locale: 'uk-UA' });

    test('/ goes to /uk on the first visit', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/uk$/);
      expect(await htmlLang(page)).toBe('uk');
    });

    test('a saved English choice keeps / in English', async ({ page, context }) => {
      await context.addCookies([
        { name: 'NEXT_LOCALE', value: 'en', url: 'http://localhost:3100' },
      ]);
      await page.goto('/');
      expect(new URL(page.url()).pathname).toBe('/');
      expect(await htmlLang(page)).toBe('en');
    });
  });

  test.describe('English browser', () => {
    test.use({ locale: 'en-US' });

    test('/ stays English', async ({ page }) => {
      await page.goto('/');
      expect(new URL(page.url()).pathname).toBe('/');
      expect(await htmlLang(page)).toBe('en');
    });
  });

  test.describe('other-language browser', () => {
    test.use({ locale: 'de-DE' });

    test('/ stays English', async ({ page }) => {
      await page.goto('/');
      expect(new URL(page.url()).pathname).toBe('/');
      expect(await htmlLang(page)).toBe('en');
    });
  });
});

const MONTHS_GENITIVE = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
];

/** Independent date formatting so the UI is checked against a fixed truth. */
function expectedUkDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_GENITIVE[m - 1]} ${y} р.`;
}

test.describe('translated content', { tag: SPEC_TAGS }, () => {
  const UK_PAGES = [
    '/uk',
    '/uk/services',
    '/uk/portfolio',
    '/uk/about-us',
    '/uk/contacts',
    '/uk/privacy-policy',
    '/uk/terms-of-use',
    '/uk/portfolio/calmisu',
  ];

  for (const path of UK_PAGES) {
    test(`every internal link on ${path} stays under /uk`, async ({ page }) => {
      await page.goto(path);
      const hrefs = await page.$$eval('a[href^="/"]', (links) =>
        links
          // The switcher's own English option is the one intentional exception.
          .filter((a) => !a.closest('[role="group"]'))
          .map((a) => a.getAttribute('href') ?? ''),
      );
      expect(hrefs.length).toBeGreaterThan(3);
      for (const href of hrefs) expect(href, `${path} -> ${href}`).toMatch(/^\/uk(?:[/#?]|$)/);
    });
  }

  for (const doc of legalDocuments.uk) {
    test(`/uk/${doc.slug} shows the prevailing note and a Ukrainian date`, async ({ page }) => {
      await page.goto(`/uk/${doc.slug}`);
      await expect(page.getByRole('heading', { level: 1, name: doc.title })).toBeVisible();
      const note = page.getByRole('note');
      await expect(note).toBeVisible();
      await expect(note).toContainText('англійська версія');
      await expect(note).toContainText('переважну силу');
      await expect(page.getByText(expectedUkDate(doc.lastUpdated)).first()).toBeVisible();
      expect(await htmlLang(page)).toBe('uk');
      await expect(page).toHaveTitle(new RegExp(doc.title));
    });
  }

  test('the English legal page has no prevailing note', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('note')).toHaveCount(0);
  });
});

test.describe('uk not found', { tag: SPEC_TAGS }, () => {
  test('/uk/nope shows a Ukrainian message with a link to the Ukrainian home', async ({ page }) => {
    await page.goto('/uk/nope');
    await expect(page.getByRole('heading', { name: 'Сторінку не знайдено' })).toBeVisible();
    const home = page.getByRole('link', { name: 'На головну', exact: true });
    await expect(home).toBeVisible();
    await expect(home).toHaveAttribute('href', '/uk');
  });
});
