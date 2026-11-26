import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { listCardsForTree, listFolders, listPublicFolders, requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ params, fetch, locals, url }) => {
	const token = requireAuth(locals);
	const context = { fetch, token };

	// Own decks + other users' public decks (so public decks from search are accessible)
	const [ownFolders, publicFolders] = await Promise.all([
		listFolders(context),
		listPublicFolders(context)
	]);
	const seen = new Set<string>();
	const folders = [...ownFolders, ...publicFolders].filter((folder) => {
		if (seen.has(folder.id)) return false;
		seen.add(folder.id);
		return true;
	});

	const folder = folders.find((item) => item.id === params.deckid);
	if (!folder) error(404, 'Folder not found');

	const includeAll = url.searchParams.get('all') === '1';
	const cards = await listCardsForTree(context, folders, params.deckid, { includeAll });
	if (url.searchParams.get('shuffle') === '1') {
		// Fisher-Yates shuffle so each launch gets a fresh order.
		for (let i = cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[cards[i], cards[j]] = [cards[j], cards[i]];
		}
	}

	return {
		folder,
		cards,
		reversed: url.searchParams.get('reverse') === '1'
	};
};
