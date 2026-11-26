import type { PageServerLoad } from './$types';
import { listCards, listFolders, listPublicFolders, requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	const token = requireAuth(locals);
	const context = { fetch, token };
	const query = params.search.trim();
	const term = query.toLowerCase();

	// Own public decks + other users' public decks (private decks are excluded)
	const [ownFolders, publicFolders] = await Promise.all([
		listFolders(context, { excludePrivate: true }),
		listPublicFolders(context)
	]);
	// The authenticated user's email is authoritative for decks they own.
	const ownFoldersWithOwner = ownFolders.map((folder) => ({
		...folder,
		ownerEmail: locals.user?.email ?? folder.ownerEmail
	}));

	// Deduplicate by id (in case a deck appears in both lists)
	const seen = new Set<string>();
	const folders = [...ownFoldersWithOwner, ...publicFolders].filter((folder) => {
		if (seen.has(folder.id)) return false;
		seen.add(folder.id);
		return true;
	});

	const cardsByFolder = await Promise.all(
		folders.map(async (folder) => ({ folder, cards: await listCards(context, folder.id) }))
	);
	const allCards = cardsByFolder.flatMap(({ folder, cards }) =>
		cards.map((item) => ({ ...item, deckName: folder.name }))
	);

	const matchingFolders = query
		? folders
				.filter((folder) => folder.name.toLowerCase().includes(term))
				.map((folder) => ({
					...folder,
					cardCount: allCards.filter((item) => item.deckid === folder.id).length
				}))
		: [];
	const matchingCards = query
		? allCards.filter(
				(item) =>
					item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term)
			)
		: [];

	return { query, folders: matchingFolders, cards: matchingCards };
};
