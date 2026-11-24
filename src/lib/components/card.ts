export interface card {
  id: string;
  question: string;
  answer: string;
  answerHistory?: answerHistory[] | null;
  showIn: string;
  deckid: string;
  created: string; //date YYYY-MM-DDTHH:MM:SS
}

export interface answerHistory {
  date: string;
  answer: number; // from -1 to 3
  timeSpentAnswaring: number; //miliseconds
}
