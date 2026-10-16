import { formatLead } from '@/server/contact/formatLead';
import { isTelegramConfigured, sendTelegramMessage } from '@/server/contact/telegram';
import { parseContactRequest } from '@/server/contact/validate';
import { getClientIp } from '@/server/http/getClientIp';
import { createRateLimiter } from '@/server/rate-limit/createRateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 10 * 1024;

// In-memory per server instance (resets on cold start, not shared between serverless instances).
const limiter = createRateLimiter({
  prefix: 'contact',
  rules: [
    { name: 'burst', limit: 5, windowMs: 600_000 },
    { name: 'daily', limit: 20, windowMs: 86_400_000 },
  ],
});

const json = (
  body: { ok?: true; error?: string; fields?: object; retryAfter?: number },
  status: number,
  headers: Record<string, string> = {},
): Response =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

/**
 * Order: body cap -> JSON parse -> validation (400) -> honeypot (200, nothing sent, not counted
 * against the limiter: it costs us nothing) -> env check (503, before consuming rate-limit quota)
 * -> rate limit (429) -> Telegram send (200 / 502). Logs never contain personal data.
 */
export async function POST(req: Request): Promise<Response> {
  const declared = Number(req.headers.get('content-length'));
  if (declared > MAX_BODY_BYTES) return json({ error: 'invalid_request' }, 400);

  let body: unknown;
  try {
    const text = await req.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
      return json({ error: 'invalid_request' }, 400);
    }
    body = JSON.parse(text);
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }

  const parsed = parseContactRequest(body);
  if (!parsed.ok) {
    return parsed.error === 'validation'
      ? json({ error: 'validation', fields: parsed.fields }, 400)
      : json({ error: 'invalid_request' }, 400);
  }

  if (parsed.honeypot) return json({ ok: true }, 200);

  if (!isTelegramConfigured()) return json({ error: 'disabled' }, 503);

  const limit = await limiter.check(getClientIp(req.headers));
  if (!limit.ok) {
    return json({ error: 'rate_limited', retryAfter: limit.retryAfterSec }, 429, {
      'Retry-After': String(limit.retryAfterSec),
    });
  }

  const result = await sendTelegramMessage(formatLead(parsed.data));
  if (!result.ok)
    return json(
      { error: result.reason === 'disabled' ? 'disabled' : 'unavailable' },
      result.reason === 'disabled' ? 503 : 502,
    );

  return json({ ok: true }, 200);
}
