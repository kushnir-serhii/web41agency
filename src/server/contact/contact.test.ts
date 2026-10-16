/*
 * @spec: 005-multilingual-site-ukrainian - acceptance traceability for the Free Quote backend.
 * 2.5 "Language: Ukrainian" / "Language: English" on every request ... formatLead
 * 2.5 locale carried by the request (default en, unknown rejected) ... parseContactRequest
 * 2.5 request reaches the agency chat (Telegram), failure modes ...... POST /api/contact
 * MANUAL: real Telegram delivery to the agency chat (needs a live bot token).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatLead } from './formatLead';
import { CONTACT_LIMITS, parseContactRequest } from './validate';

const TAGS = '@spec:005-multilingual-site-ukrainian @regression';

const valid = { name: 'Олена', email: 'olena@example.com', message: 'Hi', page: '/services' };

describe(`${TAGS} parseContactRequest`, () => {
  it('accepts a valid uk request and trims fields', () => {
    expect(parseContactRequest({ ...valid, name: '  Олена ', locale: 'uk', website: '' })).toEqual({
      ok: true,
      data: { ...valid, locale: 'uk' },
      honeypot: false,
    });
  });

  it('defaults a missing locale to en and rejects an unknown or non-string locale', () => {
    expect(parseContactRequest(valid)).toMatchObject({ ok: true, data: { locale: 'en' } });
    for (const locale of ['de', 'UK', '', 1, null]) {
      expect(parseContactRequest({ ...valid, locale })).toEqual({
        ok: false,
        error: 'invalid_request',
      });
    }
  });

  it('flags the honeypot when the hidden website field is filled', () => {
    expect(parseContactRequest({ ...valid, website: 'http://spam' })).toMatchObject({
      ok: true,
      honeypot: true,
    });
  });

  it('reports required name and email as field errors', () => {
    expect(parseContactRequest({ ...valid, name: '   ', email: '' })).toEqual({
      ok: false,
      error: 'validation',
      fields: { name: 'required', email: 'required' },
    });
  });

  it('reports malformed and over-long emails as invalid', () => {
    for (const email of [
      'nope',
      'a@b',
      'a b@c.com',
      `${'a'.repeat(CONTACT_LIMITS.emailMaxChars)}@x.io`,
    ]) {
      expect(parseContactRequest({ ...valid, email }), email).toEqual({
        ok: false,
        error: 'validation',
        fields: { email: 'invalid' },
      });
    }
  });

  it.each([
    ['non-object body', 'x'],
    ['null body', null],
    ['array body', []],
    ['non-string name', { ...valid, name: 5 }],
    ['non-string email', { ...valid, email: 5 }],
    ['non-string message', { ...valid, message: 5 }],
    ['over-long name', { ...valid, name: 'a'.repeat(CONTACT_LIMITS.nameMaxChars + 1) }],
    ['over-long message', { ...valid, message: 'a'.repeat(CONTACT_LIMITS.messageMaxChars + 1) }],
    ['over-long page', { ...valid, page: '/'.repeat(CONTACT_LIMITS.pageMaxChars + 1) }],
  ])('rejects %s as invalid_request', (_name, body) => {
    expect(parseContactRequest(body)).toEqual({ ok: false, error: 'invalid_request' });
  });
});

describe(`${TAGS} formatLead`, () => {
  const lead = { name: 'Олена', email: 'o@x.io', message: 'Привіт', page: '/services' } as const;

  it('shows "Language: Ukrainian" and the /uk page for uk', () => {
    const text = formatLead({ ...lead, locale: 'uk' });
    expect(text).toContain('Language: Ukrainian');
    expect(text).toContain('Page: /uk/services');
    expect(formatLead({ ...lead, locale: 'uk', page: '/' })).toContain('Page: /uk\n');
  });

  it('shows "Language: English" and the unprefixed page for en', () => {
    const text = formatLead({ ...lead, locale: 'en' });
    expect(text).toContain('Language: English');
    expect(text).not.toContain('Ukrainian');
    expect(text).toContain('Page: /services');
  });

  it('HTML-escapes every user-supplied field', () => {
    const text = formatLead({
      name: '<b>x</b>',
      email: 'a&b@x.io',
      message: '<script>alert(1)</script>',
      page: '/<i>',
      locale: 'en',
    });
    expect(text).not.toMatch(/<(?:b|script|i)>/);
    expect(text).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(text).toContain('a&amp;b@x.io');
    expect(text).toContain('&lt;script&gt;');
  });

  it('shows an empty message as an em dash', () => {
    expect(formatLead({ ...lead, message: '   ', locale: 'en' }).endsWith('Message:\n—')).toBe(
      true,
    );
  });
});

describe(`${TAGS} POST /api/contact`, () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  const configure = (configured = true) => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', configured ? 'test-token' : '');
    vi.stubEnv('TELEGRAM_CHAT_ID', configured ? '12345' : '');
  };

  const load = async (telegramStatus = 200) => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: telegramStatus }));
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { POST } = await import('@/app/api/contact/route');
    const send = (body: unknown, ip = '203.0.113.1') =>
      POST(
        new Request('http://localhost/api/contact', {
          method: 'POST',
          headers: { 'x-forwarded-for': ip },
          body: typeof body === 'string' ? body : JSON.stringify(body),
        }),
      );
    return { fetchMock, send };
  };

  it('sends a uk lead to Telegram with the language mark and answers 200', async () => {
    configure();
    const { fetchMock, send } = await load();
    const res = await send({ ...valid, locale: 'uk' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.telegram.org/bottest-token/sendMessage');
    const sent = JSON.parse(init.body as string);
    expect(sent.chat_id).toBe('12345');
    expect(sent.text).toContain('Language: Ukrainian');
  });

  it('an en lead carries "Language: English"', async () => {
    configure();
    const { fetchMock, send } = await load();
    await send({ ...valid, locale: 'en' });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string).text).toContain('Language: English');
  });

  it('honeypot answers 200 and sends nothing', async () => {
    configure();
    const { fetchMock, send } = await load();
    const res = await send({ ...valid, website: 'spam' });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Telegram failure answers 502', async () => {
    configure();
    const { fetchMock, send } = await load(500);
    const res = await send(valid);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'unavailable' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('missing Telegram env answers 503 and never calls fetch', async () => {
    configure(false);
    const { fetchMock, send } = await load();
    const res = await send(valid);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'disabled' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('validation problems answer 400 with field codes and send nothing', async () => {
    configure();
    const { fetchMock, send } = await load();
    const res = await send({ ...valid, name: '', email: 'bad' });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: 'validation',
      fields: { name: 'required', email: 'invalid' },
    });
    expect((await send('{not json')).status).toBe(400);
    expect((await send({ ...valid, locale: 'de' })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('answers 429 after the burst limit of 5 for the same client, other clients unaffected', async () => {
    configure();
    const { fetchMock, send } = await load();
    for (let i = 0; i < 5; i += 1) expect((await send(valid, '198.51.100.7')).status).toBe(200);
    const limited = await send(valid, '198.51.100.7');
    expect(limited.status).toBe(429);
    expect(limited.headers.get('retry-after')).toBeTruthy();
    expect((await limited.json()).error).toBe('rate_limited');
    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect((await send(valid, '198.51.100.8')).status).toBe(200);
  });
});
