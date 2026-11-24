import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { apiRequest, listFolders, requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	const token = requireAuth(locals);
	const folders = await listFolders({ fetch, token });
	const folder = folders.find((item) => item.id === params.deckid);
	if (!folder) error(404, 'Folder not found');
	return { folder, folders };
};

export const actions: Actions = {
	create: async ({ request, params, fetch, locals }) => {
		const token = requireAuth(locals);
		const form = await request.formData();
		const question = String(form.get('question') ?? '').trim();
		const answer = String(form.get('answer') ?? '').trim();
		const folderId = String(form.get('folderId') ?? params.deckid);

		if (!question || !answer) return fail(400, { error: 'Question and answer are required.' });

		await apiRequest({ fetch, token }, `/folders/${encodeURIComponent(folderId)}/cards`, {
			method: 'POST',
			body: JSON.stringify({ question, answer, type: 'basic' })
		});

		redirect(303, `/modifyDeck/${encodeURIComponent(folderId)}`);
	}
};
