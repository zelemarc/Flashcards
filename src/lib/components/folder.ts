export interface folder {
  id: string;
  name: string | "card deck";
  parentid?: string | null;
  new: number | 0;
  learn: number | 0;
  due: number | 0;
  nextCard: string;
  private: boolean | true;
  created: string; //date YYYY-MM-DDTHH:MM:SS
}
