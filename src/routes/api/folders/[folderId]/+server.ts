import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { apiRequest, requireAuth } from '#lib/server/api.ts';

export const PATCH: RequestHandler = async ({ params, request, fetch, locals }) => {
	const token = requireAuth(locals);
	const body = (await request.json().catch(() => null)) as {
		name?: string;
		public?: boolean;
	} | null;
	if (!body || (body.name === undefined && body.public === undefined)) {
		error(400, 'Provide a folder name or public status.');
	}
	return json(
		await apiRequest({ fetch, token }, `/folders/${encodeURIComponent(params.folderId)}`, {
			method: 'PATCH',
			body: JSON.stringify(body)
		})
	);
};

export const POST: RequestHandler = async ({ params, fetch, locals }) => {
	const token = requireAuth(locals);
	return json(
		await apiRequest({ fetch, token }, `/folders/${encodeURIComponent(params.folderId)}/copy`, {
			method: 'POST'
		}),
		{ status: 201 }
	);
};

export const DELETE: RequestHandler = async ({ params, fetch, locals }) => {
	const token = requireAuth(locals);
	return json(
		await apiRequest({ fetch, token }, `/folders/${encodeURIComponent(params.folderId)}`, {
			method: 'DELETE'
		})
	);
};
