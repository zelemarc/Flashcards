import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { apiRequest, requireAuth } from '#lib/server/api.ts';

export const POST: RequestHandler = async ({ params, request, fetch, locals }) => {
	const token = requireAuth(locals);
	const body = (await request.json().catch(() => null)) as {
		rating?: number;
		time_spent_ms?: number;
	} | null;

	if (
		!body ||
		!Number.isInteger(body.rating) ||
		body.rating! < -1 ||
		body.rating! > 3 ||
		!Number.isInteger(body.time_spent_ms) ||
		body.time_spent_ms! < 0
	) {
		error(400, 'Invalid answer rating or time spent.');
	}

	const result = await apiRequest(
		{ fetch, token },
		`/cards/${encodeURIComponent(params.cardId)}/answers`,
		{
			method: 'POST',
			body: JSON.stringify(body)
		}
	);
	return json(result);
};
