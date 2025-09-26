import type { Dialog } from './Dialog';
import type { DialogLine } from '../types/DialogLine';

export interface Practice {
  id: number;
  name: string;
  topic: string;
  interest: string;
  createdAt: string;
  dialogs: DialogLine[];
}
export interface CreatePracticePayload {
  userId: number;
  name: string;
  topic: string;
  interest: string;
  dialogs: Dialog[];
}
