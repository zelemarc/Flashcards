import { error } from '@sveltejs/kit';
import * as decks from '#lib/server/example/deck.ts';
import * as cards from '#lib/server/example/cards.ts';
import type { PageServerLoad } from './$types';
import type { card } from '#lib/components/card.ts';

export const load: PageServerLoad = async ({ params }) => {
	const folderFound = decks.folders.find((e) => e.id === params.deckid);
	if (!folderFound) error(404, 'Not found');

	const cardsFiltered: card[] = cards.cards.filter((e) => e.deckid === params.deckid);

	return {
		folder: folderFound,
		cards: cardsFiltered
	};
};
