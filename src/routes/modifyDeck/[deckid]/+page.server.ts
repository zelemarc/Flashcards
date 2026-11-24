import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { apiRequest, listCards, listFolders, requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	const token = requireAuth(locals);
	const context = { fetch, token };
	const folders = await listFolders(context);
	const folder = folders.find((item) => item.id === params.deckid);
	if (!folder) error(404, 'Folder not found');
	return { folder, cards: await listCards(context, params.deckid) };
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
