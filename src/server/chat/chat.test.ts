/*
 * @spec: 004-ai-chatbot - acceptance traceability for server logic (functional-spec.md AC -> describe).
 * 2.3 500-char cap (server side) ........ parseChatRequest
 * 2.3 links, internal vs external ....... markdown link safety
 * 2.4 prices match the site, refusal, <=120 words, sensitive data, language (the deterministic part
 *     of model behaviour) ................ buildSystemPrompt, system prompt rules
 * 2.5 handoff token ..................... splitHandoff, buildSystemPrompt (handoff rule)
 * 2.7 limits 20/10 min and 60/day ....... src/server/rate-limit/createRateLimiter.test.ts
 * 2.7 kill switch (no launcher, 503) .... kill switch
 * MANUAL (pre-launch, real model): actual price/refusal/Ukrainian/card/word-count behaviour, "from $100".
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { classifyHref, isSafeHref } from '@/components/chat/markdown';
import { splitHandoff } from '@/components/chat/splitHandoff';
import { CHAT_LIMITS, HANDOFF_TOKEN } from '@/consts/chat';
import { formatUsd, PRICING, PRICING_TIERS } from '@/content/pricing';
import { CONTACT_EMAIL } from '@/utils/site';

import { isChatEnabled } from './config';
import { buildSystemPrompt } from './systemPrompt';
import { parseChatRequest } from './validate';

const user = (content: string) => ({ role: 'user', content });
const assistant = (content: string) => ({ role: 'assistant', content });

describe('@spec:004-ai-chatbot @regression parseChatRequest', () => {
  it('accepts a valid conversation and drops extra keys', () => {
    const result = parseChatRequest({
      messages: [{ ...user('Hi'), extra: 1 }, assistant('Hello'), user('Price?')],
    });
    expect(result).toEqual({
      ok: true,
      messages: [user('Hi'), assistant('Hello'), user('Price?')],
      locale: 'en',
    });
  });

  it.each([
    ['null body', null],
    ['missing messages', {}],
    ['non-array messages', { messages: 'hi' }],
    ['empty messages', { messages: [] }],
    ['blank content', { messages: [user('   ')] }],
    ['unknown role', { messages: [{ role: 'system', content: 'x' }] }],
    ['non-string content', { messages: [{ role: 'user', content: 5 }] }],
  ])('rejects %s', (_name, body) => {
    expect(parseChatRequest(body)).toEqual({ ok: false });
  });

  it('rejects more than the max number of messages', () => {
    const tooMany = Array.from({ length: CHAT_LIMITS.maxMessages + 1 }, (_, i) =>
      i % 2 === 0 ? user('q') : assistant('a'),
    );
    expect(tooMany[tooMany.length - 1].role).toBe('user');
    expect(parseChatRequest({ messages: tooMany })).toEqual({ ok: false });
  });

  it('accepts exactly the max number of messages', () => {
    const msgs = Array.from({ length: CHAT_LIMITS.maxMessages }, (_, i) =>
      i % 2 === 0 ? assistant('a') : user('q'),
    );
    expect(parseChatRequest({ messages: msgs }).ok).toBe(true);
  });

  it('rejects when the last message is not from the user', () => {
    expect(parseChatRequest({ messages: [user('Hi'), assistant('Hello')] })).toEqual({
      ok: false,
    });
  });

  it('rejects a user message over the char limit, accepts exactly the limit', () => {
    const max = CHAT_LIMITS.userMaxChars;
    expect(parseChatRequest({ messages: [user('a'.repeat(max + 1))] })).toEqual({ ok: false });
    expect(parseChatRequest({ messages: [user('a'.repeat(max))] }).ok).toBe(true);
  });

  it('allows longer assistant messages but rejects over the assistant limit', () => {
    const long = assistant('a'.repeat(CHAT_LIMITS.userMaxChars + 1));
    expect(parseChatRequest({ messages: [long, user('ok')] }).ok).toBe(true);
    const tooLong = assistant('a'.repeat(CHAT_LIMITS.assistantMaxChars + 1));
    expect(parseChatRequest({ messages: [tooLong, user('ok')] })).toEqual({ ok: false });
  });
});

describe('@spec:004-ai-chatbot @regression buildSystemPrompt', () => {
  const prompt = buildSystemPrompt();

  it.each(Object.entries(PRICING))('contains the formatted %s price', (_key, usd) => {
    expect(prompt).toContain(formatUsd(usd));
  });

  it('contains the contact email and the handoff token', () => {
    expect(prompt).toContain(CONTACT_EMAIL);
    expect(prompt).toContain(HANDOFF_TOKEN);
  });

  it('contains no dates', () => {
    expect(prompt).not.toMatch(/\b(?:19|20)\d{2}\b/);
    expect(prompt).not.toMatch(/\b\d{4}-\d{2}-\d{2}\b/);
    expect(prompt).not.toMatch(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
  });

  it('is stable between calls', () => {
    expect(buildSystemPrompt()).toBe(prompt);
  });
});

describe('@spec:004-ai-chatbot @regression splitHandoff', () => {
  it('detects the token at the end and strips it', () => {
    expect(splitHandoff(`Hi ${HANDOFF_TOKEN}`, { final: true })).toEqual({
      text: 'Hi',
      handoff: true,
    });
  });

  it('returns plain text unchanged without handoff', () => {
    expect(splitHandoff('Hello there', { final: false })).toEqual({
      text: 'Hello there',
      handoff: false,
    });
  });

  it('handles a token split across chunks', () => {
    let raw = 'Hi [[HAND';
    expect(splitHandoff(raw, { final: false })).toEqual({ text: 'Hi', handoff: false });
    raw += 'OFF]]';
    expect(splitHandoff(raw, { final: false })).toEqual({ text: 'Hi', handoff: true });
  });

  it('hides a partial token prefix while streaming and shows it on final', () => {
    expect(splitHandoff('Hello[[HAN', { final: false })).toEqual({
      text: 'Hello',
      handoff: false,
    });
    expect(splitHandoff('Hello[[HAN', { final: true })).toEqual({
      text: 'Hello[[HAN',
      handoff: false,
    });
  });
});

describe('@spec:004-ai-chatbot @regression markdown link safety', () => {
  it.each(['javascript:alert(1)', 'JavaScript:alert(1)', 'data:text/html,x', '//evil.com', ''])(
    'rejects %j',
    (href) => {
      expect(classifyHref(href)).toBeNull();
      expect(isSafeHref(href)).toBe(false);
    },
  );

  it('classifies internal, external and mailto links', () => {
    expect(classifyHref('/portfolio')).toBe('internal');
    expect(classifyHref('/#lets-talk')).toBe('internal');
    expect(classifyHref('https://example.com/a')).toBe('external');
    expect(classifyHref('mailto:hello@web41.agency')).toBe('mailto');
    expect(isSafeHref('/services')).toBe(true);
  });
});

describe('@spec:004-ai-chatbot @regression system prompt rules (FS 2.4)', () => {
  const prompt = buildSystemPrompt();

  it.each(PRICING_TIERS.map((t) => [t.label, t.usd] as const))(
    'quotes %s only as "from $X" with the site price',
    (label, usd) => {
      expect(prompt).toContain(`- ${label}: from ${formatUsd(usd)}`);
    },
  );

  it('carries the scope, refusal, no-invention, length, language and sensitive-data rules', () => {
    expect(prompt).toMatch(/Talk only about Web41/);
    expect(prompt).toMatch(/politely decline anything else/);
    expect(prompt).toMatch(/Never invent prices, dates, discounts or guarantees/);
    expect(prompt).toMatch(/suggest the free quote or email/);
    expect(prompt).toMatch(/under 120 words/);
    expect(prompt).toMatch(/reply in the visitor's language/);
    expect(prompt).toMatch(
      /Never ask for or repeat sensitive data such as passwords or card numbers/,
    );
  });

  it('limits the handoff token to price, timeline or starting a project', () => {
    expect(prompt).toMatch(
      /Only when the visitor asks about price, timeline or starting a project/,
    );
    expect(prompt).toMatch(/Otherwise never output it/);
  });
});

describe('@spec:004-ai-chatbot @regression kill switch (FS 2.7)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.doUnmock('./provider');
  });

  const setEnv = (flag: string | undefined, key = 'sk-test', model = 'gpt-test') => {
    vi.stubEnv('NEXT_PUBLIC_CHAT_ENABLED', flag as string);
    vi.stubEnv('OPENAI_API_KEY', key);
    vi.stubEnv('OPENAI_MODEL', model);
  };

  it('is off unless the flag is exactly "true"', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const flag of ['false', '', '1', 'TRUE', undefined]) {
      setEnv(flag);
      expect(isChatEnabled()).toBe(false);
    }
    setEnv('true');
    expect(isChatEnabled()).toBe(true);
  });

  it('is off when the OpenAI key is missing even if the flag is on', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    setEnv('true', '');
    expect(isChatEnabled()).toBe(false);
  });

  it('the API route answers 503 and never calls the provider when switched off', async () => {
    const streamChat = vi.fn();
    vi.doMock('./provider', () => ({ streamChat }));
    vi.doMock('@/server/chat/provider', () => ({ streamChat }));
    setEnv('false');
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
      }),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'disabled' });
    expect(streamChat).not.toHaveBeenCalled();
  });

  it('the layout renders the chat loader only behind the flag', () => {
    const layout = readFileSync(path.resolve(__dirname, '../../app/[locale]/layout.tsx'), 'utf8');
    expect(layout).toMatch(/process\.env\.NEXT_PUBLIC_CHAT_ENABLED === 'true' && <ChatLoader \/>/);
  });
});

describe('@spec:005-multilingual-site-ukrainian @regression chat locale (FS 2.6)', () => {
  const uk = buildSystemPrompt('uk');
  const en = buildSystemPrompt('en');

  it('parseChatRequest accepts uk, defaults a missing locale to en and rejects others', () => {
    const messages = [user('Привіт')];
    expect(parseChatRequest({ messages, locale: 'uk' })).toEqual({
      ok: true,
      messages,
      locale: 'uk',
    });
    expect(parseChatRequest({ messages })).toMatchObject({ ok: true, locale: 'en' });
    expect(parseChatRequest({ messages, locale: 'en' })).toMatchObject({ ok: true, locale: 'en' });
    for (const locale of ['de', 'UK', '', 5, null]) {
      expect(parseChatRequest({ messages, locale })).toEqual({ ok: false });
    }
  });

  it('the uk prompt carries the Ukrainian language rule; the en prompt does not', () => {
    expect(uk).toMatch(/Reply in Ukrainian/);
    expect(uk).toMatch(/Ukrainian glossary/);
    expect(en).not.toMatch(/Reply in Ukrainian/);
    expect(en).not.toMatch(/Ukrainian glossary/);
    expect(uk).not.toBe(en);
  });

  it('the uk prompt links only to /uk pages; the en prompt has no /uk links', () => {
    const internal = (p: string) => [...p.matchAll(/\]\((\/[^)]*|#[^)]*)\)/g)].map((m) => m[1]);
    const ukLinks = internal(uk);
    expect(ukLinks.length).toBeGreaterThan(0);
    for (const href of ukLinks) expect(href).toMatch(/^\/uk(?:[/#]|$)/);
    expect(uk).toContain('(/uk#lets-talk)');
    expect(internal(en).every((h) => !h.startsWith('/uk'))).toBe(true);
    expect(en).toContain('(/#lets-talk)');
  });

  it('the uk prompt quotes the same USD prices and the same HANDOFF_TOKEN as en', () => {
    for (const tier of PRICING_TIERS) {
      expect(uk).toContain(`- ${tier.label}: from ${formatUsd(tier.usd)}`);
    }
    for (const usd of Object.values(PRICING)) expect(uk).toContain(formatUsd(usd));
    expect(uk).toContain(HANDOFF_TOKEN);
    expect(uk).toContain(CONTACT_EMAIL);
    const priceLines = (p: string) => p.split('\n').filter((l) => /: from \$/.test(l));
    expect(priceLines(uk)).toEqual(priceLines(en));
    expect(uk).not.toMatch(/\b(?:19|20)\d{2}\b/);
  });

  it('the glossary maps site terms to the Ukrainian names used on the site', () => {
    expect(uk).toContain('Free Quote = Безкоштовна оцінка');
    expect(uk).toContain('Services = Послуги');
  });

  it('is memoised per locale (same string on repeated calls)', () => {
    expect(buildSystemPrompt('uk')).toBe(uk);
    expect(buildSystemPrompt('en')).toBe(en);
    expect(buildSystemPrompt()).toBe(en);
  });
});
