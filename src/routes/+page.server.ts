import { error } from '@sveltejs/kit';
import * as decks from '#lib/server/example/deck.ts';
import type { PageServerData } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    return {
      folders: decks.folders,
		};

	error(404, 'Not found');
};
