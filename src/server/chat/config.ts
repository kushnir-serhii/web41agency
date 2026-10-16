import 'server-only';

export interface IOpenAiConfig {
  apiKey: string;
  model: string;
}

const readEnv = (name: string): string | undefined => process.env[name]?.trim() || undefined;

const logMissing = (name: string): void => {
  // Variable NAME only, never a value.
  // eslint-disable-next-line no-console -- server log, variable name only
  console.error(`[chat] missing env var: ${name}`);
};

export function getOpenAiConfig(): IOpenAiConfig | null {
  const apiKey = readEnv('OPENAI_API_KEY');
  const model = readEnv('OPENAI_MODEL');
  if (!apiKey) logMissing('OPENAI_API_KEY');
  if (!model) logMissing('OPENAI_MODEL');
  return apiKey && model ? { apiKey, model } : null;
}

export function isChatEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_CHAT_ENABLED !== 'true') return false;
  return getOpenAiConfig() !== null;
}
