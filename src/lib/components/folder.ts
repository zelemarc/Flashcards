export interface folder {
  id: string;
	name: string | "card deck";
  subfolders?: folder[] | null;
  new: number | 0;
  learn: number | 0;
  due: number | 0;
  private: boolean | true;
}
