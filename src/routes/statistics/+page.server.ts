import type { PageServerLoad } from './$types';
import { apiRequest, requireAuth, type StatisticsDTO } from '#lib/server/api.ts';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const token = requireAuth(locals);
	return {
		statistics: await apiRequest<StatisticsDTO>({ fetch, token }, '/statistics?days=30')
	};
};
