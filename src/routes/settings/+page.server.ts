import type { PageServerLoad } from './$types';
import { requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const token = requireAuth(locals);
	const me = await fetch(`${process.env.BACKEND_URL || 'http://127.0.0.1:8000'}/auth/me`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const user = (await me.json()) as { id: number; email: string };
	return { user, token };
};
