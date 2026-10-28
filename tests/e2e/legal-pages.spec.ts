import { createRequire } from 'node:module';

import { expect, type Page, test } from '@playwright/test';

import { legalDocuments } from '@/content/legal';
import type { LegalDocument } from '@/content/legal/types';
import { formatLegalDate, getReadingMinutes, getTocItems } from '@/content/legal/utils';
import { slugify } from '@/utils/slugify';

const SPEC = '@spec: 003-legal-pages-redesign';
const tag = { tag: '@regression', annotation: { type: 'spec', description: SPEC } };

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Independent date formatting (no timezone APIs) so the UI is checked against a fixed truth. */
function expectedDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const docs = legalDocuments.en.map((doc) => {
  const other = legalDocuments.en.find((d) => d.slug !== doc.slug)!;
  return {
    doc,
    path: `/${doc.slug}`,
    otherTitle: other.title,
    otherPath: `/${other.slug}`,
    question:
      doc.slug === 'privacy-policy'
        ? 'Questions about this policy?'
        : 'Questions about these terms?',
  };
});

const desktopToc = (page: Page) => page.getByRole('navigation', { name: 'On this page' });
const mobileToc = (page: Page) => page.getByRole('navigation', { name: 'Table of contents' });
const switcher = (page: Page) => page.getByRole('navigation', { name: 'Legal documents' });
const activeTocLink = (page: Page) => desktopToc(page).locator('a[aria-current="true"]');
const sections = (page: Page) => page.locator('article > section[id]');

test.describe(`helpers (no browser) ${SPEC}`, () => {
  test('formatLegalDate returns the full date regardless of process timezone', tag, () => {
    expect(formatLegalDate('2026-09-18', 'en')).toBe('September 18, 2026');
    expect(formatLegalDate('2026-01-01', 'en')).toBe('January 1, 2026');
    expect(formatLegalDate('2026-12-31', 'en')).toBe('December 31, 2026');

    // The formatter is built at module load, so reload the module under a UTC-8 process timezone.
    const previousTz = process.env.TZ;
    process.env.TZ = 'America/Los_Angeles';
    try {
      const nodeRequire = createRequire(__filename);
      const key = Object.keys(nodeRequire.cache).find((k) => /legal[\\/]utils\.ts$/.test(k));
      expect(key, 'utils module should be loaded').toBeTruthy();
      delete nodeRequire.cache[key!];
      const fresh = nodeRequire(key!) as {
        formatLegalDate: (iso: string, locale: string) => string;
      };
      expect(fresh.formatLegalDate('2026-09-18', 'en')).toBe('September 18, 2026');
    } finally {
      if (previousTz === undefined) delete process.env.TZ;
      else process.env.TZ = previousTz;
    }
  });

  test('getReadingMinutes is at least 1 and rounded up at 200 wpm', tag, () => {
    const base: LegalDocument = { ...legalDocuments.en[0], summary: [], intro: [], sections: [] };
    expect(getReadingMinutes(base)).toBe(1);

    const words = (n: number) => Array.from({ length: n }, () => 'w').join(' ');
    expect(getReadingMinutes({ ...base, intro: [words(200)] })).toBe(1);
    expect(getReadingMinutes({ ...base, intro: [words(201)] })).toBe(2);
    expect(getReadingMinutes({ ...base, intro: [words(401)] })).toBe(3);
  });

  test('slugify builds URL-safe anchor ids', tag, () => {
    expect(slugify('How we protect your data')).toBe('how-we-protect-your-data');
    expect(slugify('Cookies and analytics')).toBe('cookies-and-analytics');
    expect(slugify('  Café -- Ünï!  ')).toBe('cafe-uni');
  });

  test('getTocItems numbers sections 01..N and rejects duplicate ids', tag, () => {
    for (const { doc } of docs) {
      const items = getTocItems(doc);
      expect(items.map((i) => i.number)).toEqual(
        doc.sections.map((_, i) => String(i + 1).padStart(2, '0')),
      );
    }
    const dup: LegalDocument = {
      ...legalDocuments.en[0],
      sections: [{ heading: 'Same' }, { heading: 'Same' }],
    };
    expect(() => getTocItems(dup)).toThrow(/Duplicate/);
  });
});

for (const { doc, path, otherTitle, otherPath, question } of docs) {
  test.describe(`${doc.title}: header and switcher ${SPEC}`, () => {
    test.use({ timezoneId: 'America/Los_Angeles' });

    test('breadcrumb, title, description and chips', tag, async ({ page }) => {
      await page.goto(path);
      const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
      await expect(crumbs).toHaveText(new RegExp(`Legal\s*/\s*${doc.title}$`));
      await expect(crumbs.getByText('Legal', { exact: true })).toBeVisible();
      await expect(crumbs.getByRole('link', { name: 'Legal' })).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(doc.title);
      await expect(page.getByText(doc.description, { exact: true })).toBeVisible();
      await expect(page.getByText(`${getReadingMinutes(doc)} min read`)).toBeVisible();
    });

    test('date label is the full date even in a UTC-8 timezone', tag, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByText(`Last updated ${expectedDate(doc.lastUpdated)}`)).toBeVisible();
    });

    test('switcher marks current page and navigates to the other one', tag, async ({ page }) => {
      await page.goto(path);
      const current = switcher(page).getByRole('link', { name: doc.title });
      const other = switcher(page).getByRole('link', { name: otherTitle });
      await expect(current).toHaveAttribute('aria-current', 'page');
      await expect(other).not.toHaveAttribute('aria-current', 'page');
      await expect(current).toHaveCSS('background-color', 'rgb(0, 0, 0)');
      await expect(current).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(other).toHaveCSS('border-top-width', '1px');
      await other.click();
      await expect(page).toHaveURL(new RegExp(`${otherPath}$`), { timeout: 30_000 });
      await expect(switcher(page).getByRole('link', { name: otherTitle })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });

  test.describe(`${doc.title}: summary ${SPEC}`, () => {
    const summary = (page: Page) => page.getByRole('region', { name: 'At a glance' });

    test('exactly 4 points above the intro', tag, async ({ page }) => {
      await page.goto(path);
      await expect(summary(page).getByRole('listitem')).toHaveCount(4);
      const summaryTop = await summary(page).evaluate((el) => el.getBoundingClientRect().top);
      const introTop = await page
        .getByText(doc.intro[0], { exact: true })
        .evaluate((el) => el.getBoundingClientRect().top);
      expect(summaryTop).toBeLessThan(introTop);
    });

    test('two columns at 768px', tag, async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 900 });
      await page.goto(path);
      const xs = await summary(page)
        .getByRole('listitem')
        .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
      expect(new Set(xs).size).toBe(2);
      expect(xs[0]).toBe(xs[2]);
      expect(xs[1]).toBe(xs[3]);
    });

    test('one column at 375px with nothing cut off', tag, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(path);
      const boxes = await summary(page)
        .getByRole('listitem')
        .evaluateAll((els) =>
          els.map((e) => {
            const r = e.getBoundingClientRect();
            return { left: Math.round(r.left), right: r.right };
          }),
        );
      expect(new Set(boxes.map((b) => b.left)).size).toBe(1);
      for (const b of boxes) expect(b.right).toBeLessThanOrEqual(375);
    });
  });

  test.describe(`${doc.title}: sections and anchors ${SPEC}`, () => {
    test('numbers run 01..N with no gaps', tag, async ({ page }) => {
      await page.goto(path);
      await expect(sections(page)).toHaveCount(doc.sections.length);
      const numbers = await sections(page).evaluateAll((els) =>
        els.map((e) => e.querySelector('.group > span')!.textContent),
      );
      expect(numbers).toEqual(doc.sections.map((_, i) => String(i + 1).padStart(2, '0')));
    });

    test('# link appears on hover at desktop, is faded at 375px', tag, async ({ page }) => {
      await page.goto(path);
      const target = getTocItems(doc)[1];
      const section = page.locator(`article > section#${target.id}`);
      const anchor = section.getByRole('link', { name: /^Link to / });
      await section.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await expect(anchor).toHaveCSS('opacity', '0');
      await section.getByRole('heading', { level: 2 }).hover();
      await expect(anchor).toHaveCSS('opacity', '0.4');
      await page.mouse.move(0, 0);
      await expect(anchor).toHaveCSS('opacity', '0');

      await page.setViewportSize({ width: 375, height: 800 });
      await expect(anchor).toHaveCSS('opacity', '0.4');
    });

    test(
      'clicking # updates the URL and leaves the heading below the header',
      tag,
      async ({ page }) => {
        await page.goto(path);
        const item = getTocItems(doc)[3];
        const section = page.locator(`article > section#${item.id}`);
        await section.getByRole('link', { name: /^Link to / }).click({ force: true });
        await expect(page).toHaveURL(new RegExp(`#${item.id}$`));
        const heading = section.getByRole('heading', { level: 2 });
        await expect
          .poll(async () => (await heading.boundingBox())!.y, { timeout: 5000 })
          .toBeLessThan(300);
        const headerBottom = await page.evaluate(
          () => document.querySelector('div.sticky')!.getBoundingClientRect().bottom,
        );
        expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(headerBottom);
      },
    );

    test('list items use custom dot markers', tag, async ({ page }) => {
      await page.goto(path);
      const lists = page.locator('article > section[id] ul');
      expect(await lists.count()).toBeGreaterThan(0);
      const li = lists.first().locator('li').first();
      await expect(li).toHaveCSS('list-style-type', 'none');
      const box = await li.locator('span[aria-hidden="true"]').boundingBox();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.width).toBeLessThanOrEqual(8);
    });
  });

  test.describe(`${doc.title}: table of contents ${SPEC}`, () => {
    test('is pinned while scrolling at desktop', tag, async ({ page }) => {
      await page.goto(path);
      const toc = desktopToc(page);
      const tocTop = () => toc.evaluate((el) => Math.round(el.getBoundingClientRect().top));
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
      await expect(toc).toBeInViewport();
      const pinned = await tocTop();
      // Scroll through the article itself (the TOC may leave with the grid at the page end).
      for (const fraction of [0.3, 0.6, 0.85]) {
        await page.evaluate((f) => {
          const article = document.querySelector('article')!.getBoundingClientRect();
          const target = article.top + window.scrollY + (article.height - window.innerHeight) * f;
          window.scrollTo({ top: target, behavior: 'instant' });
        }, fraction);
        await expect(toc).toBeInViewport();
        expect(await tocTop()).toBe(pinned);
      }
    });

    test('first item is active on load', tag, async ({ page }) => {
      await page.goto(path);
      await expect(activeTocLink(page)).toHaveCount(1);
      await expect(activeTocLink(page)).toContainText(doc.sections[0].heading);
    });

    test(
      'active item follows scrolling and the last item wins at the bottom',
      tag,
      async ({ page }) => {
        await page.goto(path);
        const items = getTocItems(doc);
        const mid = items[Math.floor(items.length / 2)];
        await page.evaluate((id) => {
          document.getElementById(id)!.scrollIntoView({ behavior: 'instant' });
        }, mid.id);
        await expect(activeTocLink(page)).toHaveCount(1);
        await expect(activeTocLink(page)).toContainText(mid.label);

        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await expect(activeTocLink(page)).toContainText(items[items.length - 1].label);
      },
    );

    test('clicking each item jumps there and makes it active', tag, async ({ page }) => {
      await page.goto(path);
      for (const item of getTocItems(doc)) {
        await desktopToc(page).locator(`a[href="#${item.id}"]`).click();
        await expect(page).toHaveURL(new RegExp(`#${item.id}$`));
        await expect(activeTocLink(page)).toHaveCount(1);
        await expect(activeTocLink(page)).toContainText(item.label);
      }
    });

    test('mobile card starts collapsed and closes after a tap', tag, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(path);
      const details = mobileToc(page).locator('details');
      await expect(details).not.toHaveAttribute('open', '');
      await expect(mobileToc(page).getByRole('link').first()).toBeHidden();
      await mobileToc(page).getByText('On this page').click();
      await expect(details).toHaveAttribute('open', '');
      const target = getTocItems(doc)[2];
      await mobileToc(page).locator(`a[href="#${target.id}"]`).click();
      await expect(details).not.toHaveAttribute('open', '');
      await expect(page).toHaveURL(new RegExp(`#${target.id}$`));
    });

    test('reduced motion jumps without scroll animation', tag, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const behavior = await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      );
      expect(behavior).toBe('auto');
      const target = getTocItems(doc)[4];
      const topRightAfterClick = await page.evaluate((id) => {
        document
          .querySelector<HTMLAnchorElement>(`nav[aria-label="On this page"] a[href="#${id}"]`)!
          .click();
        return document.getElementById(id)!.getBoundingClientRect().top;
      }, target.id);
      expect(Math.abs(topRightAfterClick - 128)).toBeLessThan(2);
    });
  });

  test.describe(`${doc.title}: contact card ${SPEC}`, () => {
    test('heading, mailto CTA, email text and Also read link', tag, async ({ page }) => {
      await page.goto(path);
      const card = page.getByRole('region', { name: question });
      await expect(card).toBeVisible();
      await expect(card).toHaveCSS('background-color', 'rgb(0, 0, 0)');
      const href = await card.getByRole('link', { name: 'Email us' }).getAttribute('href');
      expect(href).toMatch(/^mailto:[^@\s]+@[^@\s]+$/);
      await expect(card.getByText(href!.replace('mailto:', ''), { exact: true })).toBeVisible();

      const also = page.getByRole('link', { name: `Also read: ${otherTitle} →` });
      await expect(also).toHaveAttribute('href', otherPath);
      await also.click();
      await expect(page).toHaveURL(new RegExp(`${otherPath}$`));
    });

    test('Free Quote scrolls to the Lets talk form on the same page', tag, async ({ page }) => {
      await page.goto(path);
      await page.getByRole('link', { name: 'Get a free quote' }).first().click();
      await expect(page).toHaveURL(new RegExp(`${path}#lets-talk$`));
      await expect(page.locator('#lets-talk')).toBeInViewport();
    });
  });

  test.describe(`${doc.title}: mobile, keyboard, print ${SPEC}`, () => {
    test('no horizontal overflow and switcher on one line at 375px', tag, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(path);
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBe(innerWidth);
      const tops = await switcher(page)
        .getByRole('link')
        .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
      expect(tops).toHaveLength(2);
      expect(new Set(tops).size).toBe(1);
    });

    test('tab order reaches every control with a visible outline', tag, async ({ page }) => {
      await page.goto(path);
      await switcher(page).getByRole('link').first().focus();
      const visited: string[] = [];
      for (let i = 0; i < 80; i++) {
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const cs = getComputedStyle(el);
          return {
            text: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim(),
            href: el.getAttribute('href') ?? '',
            outlineStyle: cs.outlineStyle,
            outlineWidth: parseFloat(cs.outlineWidth),
            outlineColor: cs.outlineColor,
          };
        });
        if (info.href) {
          expect(info.outlineStyle, info.text).not.toBe('none');
          expect(info.outlineWidth, info.text).toBeGreaterThan(0);
          visited.push(info.text);
        }
        if (info.text === 'Email us') {
          // The button animates outline-color (transition-all), so wait for it to settle.
          await expect
            .poll(() =>
              page.evaluate(
                () => getComputedStyle(document.activeElement as HTMLElement).outlineColor,
              ),
            )
            .toBe('rgb(255, 255, 255)');
        }
        if (info.text.startsWith('Also read')) break;
        await page.keyboard.press('Tab');
      }
      expect(visited).toContain(doc.title);
      expect(visited).toContain(otherTitle);
      expect(visited.some((t) => t.includes(doc.sections[0].heading))).toBe(true);
      for (const s of doc.sections) expect(visited).toContain(`Link to ${s.heading}`);
      expect(visited).toContain('Email us');
      expect(visited[visited.length - 1]).toBe(`Also read: ${otherTitle} →`);
    });

    test('print hides chrome and the article is full width', tag, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ media: 'print' });
      await expect(desktopToc(page)).toBeHidden();
      await expect(mobileToc(page)).toBeHidden();
      await expect(switcher(page)).toBeHidden();
      await expect(page.getByRole('link', { name: 'Email us' })).toBeHidden();
      await expect(page.locator('#lets-talk')).toBeHidden();
      await expect(page.locator('div.sticky')).toBeHidden();
      await expect(page.locator('footer')).toBeHidden();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('region', { name: 'At a glance' })).toBeVisible();

      const widths = await page.evaluate(() => {
        const article = document.querySelector('article')!;
        return {
          article: article.getBoundingClientRect().width,
          grid: article.parentElement!.getBoundingClientRect().width,
        };
      });
      expect(widths.article).toBeGreaterThanOrEqual(widths.grid - 1);
    });
  });

  test.describe(`${doc.title}: SEO ${SPEC}`, () => {
    test(
      'Open Graph tags carry the page title, description and site image',
      tag,
      async ({ page }) => {
        await page.goto(path);
        const meta = (prop: string) =>
          page.locator(`meta[property="${prop}"]`).first().getAttribute('content');
        expect(await meta('og:title')).toBe(doc.title);
        expect(await meta('og:description')).toBe(doc.description);
        expect(await meta('og:image')).toMatch(/\/og\.png$/);
      },
    );

    test('JSON-LD has WebPage and BreadcrumbList with dateModified', tag, async ({ page }) => {
      await page.goto(path);
      const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
      const graph = raw.map((r) => JSON.parse(r)).flatMap((p) => p['@graph'] ?? [p]);
      const webPage = graph.find((n) => n['@type'] === 'WebPage');
      const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList');
      expect(webPage.dateModified).toBe(doc.lastUpdated);
      expect(webPage.name).toBe(doc.title);
      expect(crumbs.itemListElement).toHaveLength(2);
      expect(crumbs.itemListElement[1].name).toBe(doc.title);
    });
  });
}

test.describe(`privacy policy content ${SPEC}`, () => {
  test('new sections sit directly before Contact', tag, async ({ page }) => {
    await page.goto('/privacy-policy');
    const labels = await desktopToc(page).getByRole('link').allTextContents();
    const names = labels.map((l) => l.replace(/^\d+/, ''));
    const contact = names.indexOf('Contact');
    expect(names.slice(contact - 2, contact + 1)).toEqual([
      'How we protect your data',
      'Children',
      'Contact',
    ]);
    await expect(page.locator('article > section#children').getByText(/under 16/)).toBeVisible();
  });
});

test.describe(`sitemap ${SPEC}`, () => {
  test('lists lastmod for both legal URLs', tag, async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const { doc } of docs) {
      const entry = xml.split('<url>').find((u) => u.includes(`/${doc.slug}</loc>`));
      expect(entry, doc.slug).toBeTruthy();
      expect(entry).toContain(`<lastmod>${doc.lastUpdated}`);
    }
  });
});
