export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: string;
  timestamp: string;
}

export type ChatHistoryTuple = [string, string]; // [role, content]