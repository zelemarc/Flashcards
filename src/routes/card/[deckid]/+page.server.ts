import { error } from '@sveltejs/kit';
import * as cards from '#lib/server/example/cards.ts';
import type { PageServerLoad } from '../[cardid]/$types';

export const load: PageServerLoad = async ({ params }) => {
    return {
      card: cards.cards.find((e) => e.deckid = params.cardid),
		};

	error(404, 'Not found');
};
