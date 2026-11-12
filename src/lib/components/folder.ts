export interface folder {
	id: string;
	name: string;
  subfolders?: folder[] | null;
  new: number;
  learn: number;
  due: number;
}
