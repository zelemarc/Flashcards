import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	apiRequest,
	listCards,
	listFolders,
	listPublicFolders,
	requireAuth
} from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	const token = requireAuth(locals);
	const context = { fetch, token };

	// Own decks + other users' public decks (so public decks from search open here)
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

	// Read-only when the deck belongs to someone else
	const owned = ownFolders.some((item) => item.id === params.deckid);

	return {
		folder,
		cards: await listCards(context, params.deckid),
		owned,
		// Never show the viewer's email as the owner's email for somebody else's deck.
		ownerEmail: owned ? (locals.user?.email ?? folder.ownerEmail) : folder.ownerEmail
	};
};

export const actions: Actions = {
	update: async ({ request, params, fetch, locals }) => {
		const token = requireAuth(locals);
		const form = await request.formData();
		const cardId = String(form.get('cardId') ?? '');
		const question = String(form.get('question') ?? '').trim();
		const answer = String(form.get('answer') ?? '').trim();
		const type = String(form.get('type') ?? 'basic');
		if (!cardId || !question || !answer) error(400, 'Card ID, question, and answer are required.');

		await apiRequest({ fetch, token }, `/cards/${encodeURIComponent(cardId)}`, {
			method: 'PATCH',
			body: JSON.stringify({ question, answer, type })
		});
		redirect(303, `/modifyDeck/${encodeURIComponent(params.deckid)}`);
	},
	delete: async ({ request, params, fetch, locals }) => {
		const token = requireAuth(locals);
		const form = await request.formData();
		const cardId = String(form.get('cardId') ?? '');
		if (!cardId) error(400, 'Card ID is required.');

		await apiRequest({ fetch, token }, `/cards/${encodeURIComponent(cardId)}`, {
			method: 'DELETE'
		});
		redirect(303, `/modifyDeck/${encodeURIComponent(params.deckid)}`);
	}
};
