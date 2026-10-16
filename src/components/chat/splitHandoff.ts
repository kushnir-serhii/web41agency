import { HANDOFF_TOKEN } from '@/consts/chat';

interface ISplitOptions {
  final: boolean;
}

interface ISplitResult {
  text: string;
  handoff: boolean;
}

/** Longest proper prefix of the token that `text` ends with (0 if none). */
function trailingPrefixLength(text: string): number {
  const max = Math.min(HANDOFF_TOKEN.length - 1, text.length);
  for (let k = max; k > 0; k--) {
    if (text.endsWith(HANDOFF_TOKEN.slice(0, k))) return k;
  }
  return 0;
}

/**
 * Re-derives visible text and the handoff flag from the full raw stream.
 * While streaming, a trailing partial token (e.g. `[[HAN`) is hidden; on final it is shown as-is.
 */
export function splitHandoff(raw: string, { final }: ISplitOptions): ISplitResult {
  const handoff = raw.includes(HANDOFF_TOKEN);
  let text = raw.split(HANDOFF_TOKEN).join('');
  if (!final) text = text.slice(0, text.length - trailingPrefixLength(text));
  return { text: text.trimEnd(), handoff };
}
