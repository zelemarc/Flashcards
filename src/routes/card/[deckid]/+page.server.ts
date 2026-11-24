import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { listCardsForTree, listFolders, requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	const token = requireAuth(locals);
	const context = { fetch, token };
	const folders = await listFolders(context);
	const folder = folders.find((item) => item.id === params.deckid);
	if (!folder) error(404, 'Folder not found');

	return { folder, cards: await listCardsForTree(context, folders, params.deckid) };
};
