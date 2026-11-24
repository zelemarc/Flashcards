import * as decks from '#lib/server/example/deck.ts';
import * as cards from '#lib/server/example/cards.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const query = params.search.trim();
	const term = query.toLowerCase();

	const folders = query
		? decks.folders
				.filter((folder) => folder.name.toLowerCase().includes(term))
				.map((folder) => ({
					...folder,
					cardCount: cards.cards.filter((card) => card.deckid === folder.id).length
				}))
		: [];

	const matchingCards = query
		? cards.cards.filter(
				(card) =>
					card.question.toLowerCase().includes(term) || card.answer.toLowerCase().includes(term)
			)
		: [];

	const cardsWithDeck = matchingCards.map((card) => ({
		...card,
		deckName: decks.folders.find((folder) => folder.id === card.deckid)?.name ?? 'unknown deck'
	}));

	return {
		query,
		folders,
		cards: cardsWithDeck
	};
};
