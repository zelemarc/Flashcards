export interface folder {
	id: string;
	name: string;
	parentid?: string | null;
	new: number;
	learn: number;
	due: number;
	nextCard?: string;
	private: boolean;
	created?: string;
}
