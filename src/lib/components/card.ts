export interface card {
	id: string;
	question: string;
	answer: string;
	type?: string;
	favourite?: boolean;
	state?: 'new' | 'learn' | 'review';
	dueDate?: string | null;
	answerHistory?: answerHistory[] | null;
	showIn?: string;
	deckid: string;
	created?: string;
}

export interface answerHistory {
	date: string;
	answer: number; // from -1 to 3
	timeSpentAnswaring: number; //miliseconds
}
