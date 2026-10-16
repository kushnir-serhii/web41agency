import 'server-only';

const TIMEOUT_MS = 10_000;

export type TelegramResult =
  | { ok: true }
  | { ok: false; reason: 'disabled' }
  | { ok: false; reason: 'failed'; status?: number };

const getConfig = (): { token: string; chatId: string } | null => {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  return token && chatId ? { token, chatId } : null;
};

export function isTelegramConfigured(): boolean {
  return getConfig() !== null;
}

/**
 * Sends an HTML-formatted message via the Telegram Bot API. Only this file changes if the
 * provider changes. Logs only the status (never the token, body or personal data).
 */
export async function sendTelegramMessage(text: string): Promise<TelegramResult> {
  const config = getConfig();
  if (!config) return { ok: false, reason: 'disabled' };

  try {
    const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.ok) return { ok: true };
    // eslint-disable-next-line no-console -- server log, status only
    console.error(`[contact] telegram failed: ${response.status}`);
    return { ok: false, reason: 'failed', status: response.status };
  } catch (error: unknown) {
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';
    // eslint-disable-next-line no-console -- server log, error kind only
    console.error(`[contact] telegram failed: ${isTimeout ? 'timeout' : 'network'}`);
    return { ok: false, reason: 'failed' };
  }
}
