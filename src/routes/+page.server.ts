import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { apiRequest, listFolders, requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const token = requireAuth(locals);
	return { folders: await listFolders({ fetch, token }) };
};

export const actions: Actions = {
	create: async ({ request, fetch, locals }) => {
		const token = requireAuth(locals);
		const formData = await request.formData();

		const name = String(formData.get('name') ?? '').trim();
		if (!name) return fail(400, { createError: 'Enter a deck name.' });

		const parentRaw = String(formData.get('parentid') ?? '').trim();
		const parent_id = parentRaw === '' ? null : Number(parentRaw);
		if (parent_id !== null && !Number.isInteger(parent_id)) {
			return fail(400, { createError: 'Invalid parent folder.' });
		}

		try {
			const created = await apiRequest<{ id: string | number }>(
				{ fetch, token },
				'/folders',
				{
					method: 'POST',
					body: JSON.stringify({ name, parent_id })
				}
			);

			// If the user chose "public", apply it via PATCH (creation inherits parent's visibility)
			const isPublic = formData.get('public') === 'true';
			if (isPublic) {
				await apiRequest(
					{ fetch, token },
					`/folders/${encodeURIComponent(String(created.id))}`,
					{ method: 'PATCH', body: JSON.stringify({ public: true }) }
				);
			}

			return { success: true };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Could not create the deck.';
			return fail(502, { createError: message });
		}
	}
};
