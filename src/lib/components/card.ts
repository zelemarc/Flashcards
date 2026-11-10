export interface card {
  id: string;
  type: string;
  question: inputType;
  answer: inputType;
  answerHistory: answerHistory[];
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
