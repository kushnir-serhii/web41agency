import 'server-only';

/**
 * Sliding-window-log rate limiter, in-memory per server instance (resets on cold start and is not
 * shared between serverless instances). `check` is async so an Upstash/Neon backend can replace it.
 */

export interface RateLimitRule<TName extends string = string> {
  name: TName;
  limit: number;
  windowMs: number;
}

export type RateLimitResult<TName extends string = string> =
  { ok: true } | { ok: false; rule: TName; retryAfterSec: number };

export interface RateLimiter<TName extends string = string> {
  check(key: string): Promise<RateLimitResult<TName>>;
}

interface RateLimiterOptions<TName extends string> {
  prefix: string;
  rules: readonly RateLimitRule<TName>[];
}

const SWEEP_INTERVAL_MS = 60_000;
const MAX_KEYS = 5000;

export function createRateLimiter<TName extends string>({
  prefix,
  rules,
}: RateLimiterOptions<TName>): RateLimiter<TName> {
  const store = new Map<string, number[]>();
  const longestWindowMs = Math.max(...rules.map((rule) => rule.windowMs));
  let lastSweepAt = 0;

  // Timestamps are ascending, so the expired ones are a prefix.
  const prune = (stamps: number[], now: number): number[] => {
    const cutoff = now - longestWindowMs;
    let start = 0;
    while (start < stamps.length && stamps[start] <= cutoff) start += 1;
    return start === 0 ? stamps : stamps.slice(start);
  };

  const sweep = (now: number): void => {
    if (now - lastSweepAt < SWEEP_INTERVAL_MS) return;
    lastSweepAt = now;
    for (const [key, stamps] of store) {
      const pruned = prune(stamps, now);
      if (pruned.length === 0) store.delete(key);
      else if (pruned !== stamps) store.set(key, pruned);
    }
  };

  const save = (key: string, stamps: number[]): void => {
    // Re-insert so Map order reflects last write; the first key is then the oldest.
    store.delete(key);
    store.set(key, stamps);
    while (store.size > MAX_KEYS) {
      const oldest = store.keys().next();
      if (oldest.done) break;
      store.delete(oldest.value);
    }
  };

  return {
    async check(key: string): Promise<RateLimitResult<TName>> {
      const now = Date.now();
      sweep(now);

      const storeKey = `${prefix}:${key}`;
      const stamps = prune(store.get(storeKey) ?? [], now);

      for (const rule of rules) {
        const windowStart = now - rule.windowMs;
        const firstInWindow = stamps.findIndex((stamp) => stamp > windowStart);
        const count = firstInWindow === -1 ? 0 : stamps.length - firstInWindow;
        if (count >= rule.limit) {
          const oldest = stamps[firstInWindow];
          const retryAfterSec = Math.max(1, Math.ceil((oldest + rule.windowMs - now) / 1000));
          if (stamps.length === 0) store.delete(storeKey);
          else store.set(storeKey, stamps);
          return { ok: false, rule: rule.name, retryAfterSec };
        }
      }

      save(storeKey, [...stamps, now]);
      return { ok: true };
    },
  };
}
