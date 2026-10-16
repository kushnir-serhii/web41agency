import 'server-only';

import OpenAI from 'openai';

import { getOpenAiConfig } from './config';
import type { IChatMessage } from './validate';

const MAX_COMPLETION_TOKENS = 600;

export interface IStreamChatParams {
  messages: IChatMessage[];
  system: string;
  signal: AbortSignal;
}

/**
 * Streams text deltas as UTF-8 bytes. Resolves only after the first non-empty delta,
 * so a provider failure (or an empty stream) rejects and the route can answer 502.
 * Errors after the first byte error the returned stream.
 */
export async function streamChat({
  messages,
  system,
  signal,
}: IStreamChatParams): Promise<ReadableStream<Uint8Array>> {
  const config = getOpenAiConfig();
  if (!config) throw new Error('chat provider not configured');

  const client = new OpenAI({ apiKey: config.apiKey });
  const upstream = new AbortController();
  const abortUpstream = (): void => upstream.abort();
  if (signal.aborted) abortUpstream();
  else signal.addEventListener('abort', abortUpstream, { once: true });

  try {
    const completion = await client.chat.completions.create(
      {
        model: config.model,
        stream: true,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        messages: [{ role: 'system', content: system }, ...messages],
      },
      { signal: upstream.signal },
    );

    const iterator = completion[Symbol.asyncIterator]();
    const readDelta = async (): Promise<string | null> => {
      for (;;) {
        const { done, value } = await iterator.next();
        if (done) return null;
        const delta = value.choices[0]?.delta?.content;
        if (delta) return delta;
      }
    };

    const first = await readDelta();
    if (first === null) throw new Error('empty stream');

    const encoder = new TextEncoder();
    let isFirst = true;
    return new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          const text = isFirst ? first : await readDelta();
          isFirst = false;
          if (text === null) {
            signal.removeEventListener('abort', abortUpstream);
            controller.close();
            return;
          }
          controller.enqueue(encoder.encode(text));
        } catch (error: unknown) {
          signal.removeEventListener('abort', abortUpstream);
          controller.error(error);
        }
      },
      cancel() {
        signal.removeEventListener('abort', abortUpstream);
        abortUpstream();
      },
    });
  } catch (error: unknown) {
    signal.removeEventListener('abort', abortUpstream);
    abortUpstream();
    throw error;
  }
}
