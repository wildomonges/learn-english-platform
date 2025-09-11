import type { Dialog } from './Dialog';

export interface Practice {
  id: number;
  name: string;
  interest: string;
  createdAt: string;
  dialogs: Dialog[];
}
export interface CreatePracticePayload {
  userId: number;
  name: string;
  topic: string;
  interest: string;
  dialogs: Dialog[];
}
