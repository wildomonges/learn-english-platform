export interface DialogLine {
  id: number;
  speaker: string;
  textEnglish: string;
  textSpanish: string;
  response: string;
  order: number;
  score: number;
  completed: boolean;
  dialog: string;
}
