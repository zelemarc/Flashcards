import type { PageServerLoad } from './$types';
import { listFolders, requireAuth } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const token = requireAuth(locals);
	return { folders: await listFolders({ fetch, token }) };
};
