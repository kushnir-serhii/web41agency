import { expect, type Page, test } from '@playwright/test';

/*
 * @spec: 005-multilingual-site-ukrainian - Free Quote form (FS 2.5), /api/contact mocked via page.route.
 * uk empty-name message ....... 'uk form validation'
 * uk success message .......... 'uk form success'
 * uk error + mailto fallback .. 'uk form errors'
 * payload locale uk / en ...... 'payload locale'
 * MANUAL: the lead arriving in the real agency Telegram chat with "Language: ..." (formatLead is unit-tested
 *         in src/server/contact/contact.test.ts; real delivery needs a live bot).
 */
const SPEC_TAGS = ['@spec:005-multilingual-site-ukrainian', '@regression'];

interface IContactPayload {
  name: string;
  email: string;
  message: string;
  locale: string;
  page: string;
  website: string;
}

const form = (page: Page) => page.locator('section#lets-talk form');

const open = async (page: Page, path: string) => {
  await page.goto(path);
  await form(page).scrollIntoViewIfNeeded();
  await expect(form(page)).toBeVisible();
};

const fillValid = async (page: Page, labels: { name: string; email: string }) => {
  await form(page).getByLabel(labels.name).fill('Олена Коваль');
  await form(page).getByLabel(labels.email).fill('olena@example.com');
};

const UK = { name: 'Ім’я', email: 'Електронна пошта', submit: 'Надіслати запит' };
const EN = { name: 'Name', email: 'Email', submit: 'Send request' };

test.describe('uk form validation', { tag: SPEC_TAGS }, () => {
  test('an empty name shows the Ukrainian "name is required" message and sends nothing', async ({
    page,
  }) => {
    let calls = 0;
    await page.route('**/api/contact', (route) => {
      calls += 1;
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    await open(page, '/uk');
    await expect(form(page).getByLabel(UK.name)).toBeVisible();
    await form(page).getByLabel(UK.email).fill('olena@example.com');
    await form(page).getByRole('button', { name: UK.submit }).click();

    await expect(form(page).getByText('Вкажіть ім’я.')).toBeVisible();
    await expect(form(page).getByLabel(UK.name)).toHaveAttribute('aria-invalid', 'true');
    expect(calls).toBe(0);
  });

  test('an invalid email shows the Ukrainian message', async ({ page }) => {
    await open(page, '/uk');
    await form(page).getByLabel(UK.name).fill('Олена');
    await form(page).getByLabel(UK.email).fill('nope');
    await form(page).getByRole('button', { name: UK.submit }).click();
    await expect(form(page).getByText('Введіть коректну адресу електронної пошти.')).toBeVisible();
  });
});

test.describe('uk form success', { tag: SPEC_TAGS }, () => {
  test('a valid submit shows the Ukrainian success message and clears the form', async ({
    page,
  }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, json: { ok: true } }),
    );
    await open(page, '/uk/contacts');
    await fillValid(page, UK);
    await form(page).getByRole('button', { name: UK.submit }).click();

    await expect(
      form(page).getByText('Дякуємо! Запит отримано. Ми відповімо з підходом, термінами та ціною.'),
    ).toBeVisible();
    await expect(form(page).getByLabel(UK.name)).toHaveValue('');
  });
});

test.describe('uk form errors', { tag: SPEC_TAGS }, () => {
  test('a failed send shows the Ukrainian error with a working mailto fallback', async ({
    page,
  }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 502, json: { error: 'unavailable' } }),
    );
    await open(page, '/uk');
    await fillValid(page, UK);
    await form(page).getByRole('button', { name: UK.submit }).click();

    const alert = form(page).getByRole('alert');
    await expect(alert).toContainText('Зараз не вдалося надіслати ваш запит.');
    await expect(alert).toContainText('Ви також можете написати нам на');
    await expect(alert.getByRole('link')).toHaveAttribute('href', /^mailto:.+@.+/);
    await expect(alert).not.toContainText('Something went wrong');
    // Typed values are kept so the visitor can retry.
    await expect(form(page).getByLabel(UK.name)).toHaveValue('Олена Коваль');
  });

  test('a rate-limited send shows the Ukrainian rate-limit message', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 429, json: { error: 'rate_limited', retryAfter: 60 } }),
    );
    await open(page, '/uk');
    await fillValid(page, UK);
    await form(page).getByRole('button', { name: UK.submit }).click();
    await expect(form(page).getByRole('alert')).toContainText('Забагато спроб.');
  });
});

test.describe('payload locale', { tag: SPEC_TAGS }, () => {
  const submitAndCapture = async (page: Page, path: string, labels: typeof UK) => {
    const bodies: IContactPayload[] = [];
    await page.route('**/api/contact', (route) => {
      bodies.push(route.request().postDataJSON());
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    await open(page, path);
    await fillValid(page, labels);
    await form(page).getByRole('button', { name: labels.submit }).click();
    await expect.poll(() => bodies.length).toBe(1);
    return bodies[0];
  };

  test('/uk pages send locale uk and the locale-less page path', async ({ page }) => {
    const home = await submitAndCapture(page, '/uk', UK);
    expect(home.locale).toBe('uk');
    expect(home.page).toBe('/');
    expect(home.website).toBe('');

    const contacts = await submitAndCapture(page, '/uk/contacts', UK);
    expect(contacts.locale).toBe('uk');
    expect(contacts.page).toBe('/contacts');
  });

  test('English pages send locale en', async ({ page }) => {
    const home = await submitAndCapture(page, '/', EN);
    expect(home.locale).toBe('en');
    expect(home.page).toBe('/');
  });
});
