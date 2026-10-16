import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CHAT_LIMITS } from '@/consts/chat';

import { createRateLimiter } from './createRateLimiter';

const MIN = 60_000;

const makeLimiter = () =>
  createRateLimiter({
    prefix: 'chat',
    rules: [
      { name: 'burst', ...CHAT_LIMITS.burst },
      { name: 'daily', ...CHAT_LIMITS.daily },
    ],
  });

type Limiter = ReturnType<typeof makeLimiter>;

async function hit(limiter: Limiter, times: number, key = 'ip-1') {
  for (let i = 0; i < times; i += 1) {
    const result = await limiter.check(key);
    expect(result).toEqual({ ok: true });
  }
}

describe('@spec:004-ai-chatbot @regression createRateLimiter (FS 2.7: 20 per 10 min, 60 per day)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2030-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts 20 requests in 10 minutes and rejects the 21st with burst', async () => {
    const limiter = makeLimiter();
    await hit(limiter, CHAT_LIMITS.burst.limit);

    const result = await limiter.check('ip-1');
    expect(result).toEqual({ ok: false, rule: 'burst', retryAfterSec: 600 });
  });

  it('reports retryAfterSec relative to the oldest request in the window', async () => {
    const limiter = makeLimiter();
    await hit(limiter, CHAT_LIMITS.burst.limit);
    vi.advanceTimersByTime(4 * MIN + 500);

    const result = await limiter.check('ip-1');
    expect(result).toMatchObject({ ok: false, rule: 'burst' });
    // 600s window minus 240.5s elapsed = 359.5s, rounded up.
    expect(result).toHaveProperty('retryAfterSec', 360);
  });

  it('rejects the 61st request in a day with daily when burst never trips', async () => {
    const limiter = makeLimiter();
    // 3 groups of 20, 11 minutes apart: each group is outside the previous burst window.
    for (let group = 0; group < 3; group += 1) {
      await hit(limiter, CHAT_LIMITS.burst.limit);
      vi.advanceTimersByTime(11 * MIN);
    }

    const result = await limiter.check('ip-1');
    expect(result).toMatchObject({ ok: false, rule: 'daily' });
    if (!result.ok) {
      expect(result.retryAfterSec).toBeGreaterThan(CHAT_LIMITS.burst.windowMs / 1000);
      expect(result.retryAfterSec).toBeLessThanOrEqual(CHAT_LIMITS.daily.windowMs / 1000);
    }
  });

  it('reopens once the rolling window expires', async () => {
    const limiter = makeLimiter();
    await hit(limiter, CHAT_LIMITS.burst.limit);
    expect(await limiter.check('ip-1')).toMatchObject({ ok: false, rule: 'burst' });

    vi.advanceTimersByTime(CHAT_LIMITS.burst.windowMs - 1);
    expect(await limiter.check('ip-1')).toMatchObject({ ok: false, rule: 'burst' });

    vi.advanceTimersByTime(1);
    expect(await limiter.check('ip-1')).toEqual({ ok: true });
  });

  it('does not record rejected requests, so hammering does not extend the lockout', async () => {
    const limiter = makeLimiter();
    await hit(limiter, CHAT_LIMITS.burst.limit);

    for (let i = 0; i < 50; i += 1) {
      expect(await limiter.check('ip-1')).toMatchObject({ ok: false, rule: 'burst' });
    }

    vi.advanceTimersByTime(CHAT_LIMITS.burst.windowMs);
    // All 20 accepted stamps expired; a full fresh burst is available again.
    await hit(limiter, CHAT_LIMITS.burst.limit);
  });

  it('tracks keys independently', async () => {
    const limiter = makeLimiter();
    await hit(limiter, CHAT_LIMITS.burst.limit, 'ip-1');
    expect(await limiter.check('ip-1')).toMatchObject({ ok: false, rule: 'burst' });

    expect(await limiter.check('ip-2')).toEqual({ ok: true });
  });
});
