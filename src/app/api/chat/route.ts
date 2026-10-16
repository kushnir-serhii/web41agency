import { CHAT_LIMITS, type ChatErrorReason } from '@/consts/chat';
import { isChatEnabled } from '@/server/chat/config';
import { streamChat } from '@/server/chat/provider';
import { buildSystemPrompt } from '@/server/chat/systemPrompt';
import { parseChatRequest } from '@/server/chat/validate';
import { getClientIp } from '@/server/http/getClientIp';
import { createRateLimiter } from '@/server/rate-limit/createRateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 40 * 1024;

const limiter = createRateLimiter({
  prefix: 'chat',
  rules: [
    { name: 'burst', ...CHAT_LIMITS.burst },
    { name: 'daily', ...CHAT_LIMITS.daily },
  ],
});

const json = (
  body: { error: string; reason?: ChatErrorReason; retryAfter?: number },
  status: number,
  headers: Record<string, string> = {},
): Response =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export async function POST(req: Request): Promise<Response> {
  if (!isChatEnabled()) return json({ error: 'disabled' }, 503);

  const ip = getClientIp(req.headers);

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

  const parsed = parseChatRequest(body);
  if (!parsed.ok) return json({ error: 'invalid_request' }, 400);

  const limit = await limiter.check(ip);
  if (!limit.ok) {
    return json(
      { error: 'rate_limited', reason: limit.rule, retryAfter: limit.retryAfterSec },
      429,
      { 'Retry-After': String(limit.retryAfterSec) },
    );
  }

  try {
    const stream = await streamChat({
      messages: parsed.messages,
      system: buildSystemPrompt(parsed.locale),
      signal: req.signal,
    });
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console -- server log, error class only
    console.error('[chat] provider failed:', error instanceof Error ? error.name : 'unknown');
    return json({ error: 'unavailable' }, 502);
  }
}
