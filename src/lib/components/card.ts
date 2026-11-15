export interface card {
  id: string;
  type: string;
  question: string;
  answer: string;
  answerHistory?: answerHistory[] | null;
  deckid: string;
  created: string; //date YYYY-MM-DDTHH:MM:SS
}

export interface inputType {
  text: string;
  img?: ImageBitmap | null;
}

export interface answerHistory {
  date: string;
  answer: number; // from -1 to 3
  timeSpentAnswaring: number; //miliseconds
}
