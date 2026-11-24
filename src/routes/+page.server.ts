import * as decks from '#lib/server/example/deck.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		folders: decks.folders
	};
};
