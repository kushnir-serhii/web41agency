export type ChatRole = 'user' | 'assistant';

export interface IChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  handoff?: boolean;
}

export type ChatStatus = 'idle' | 'streaming' | 'error' | 'limited';
