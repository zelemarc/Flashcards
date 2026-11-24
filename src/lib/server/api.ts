import { error, redirect } from '@sveltejs/kit';
import type { card } from '#lib/components/card.ts';
import type { folder } from '#lib/components/folder.ts';

const BACKEND_URL = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export type ApiContext = {
	fetch: typeof globalThis.fetch;
	token: string;
};

export type ApiFolder = {
	id: string | number;
	name: string;
	public: boolean;
	new: number;
	learn: number;
	due: number;
	subfolders?: ApiFolder[] | null;
};

export type StatisticsDTO = {
	cards: {
		total: number;
		new: number;
		learn: number;
		review: number;
		due_now: number;
		favourites: number;
	};
	answers: {
		total: number;
		today: number;
		correct: number;
		accuracy: number | null;
		total_time_ms: number;
		avg_time_ms: number | null;
	};
	by_rating: Record<string, number>;
	daily: Array<{ date: string; answers: number; correct: number; time_ms: number }>;
	streak_days: number;
};

type ApiCard = {
	id: string | number;
	type?: string;
	question: string | { text: string; img?: string | null };
	answer: string | { text: string; img?: string | null };
	favourite?: boolean;
	state?: 'new' | 'learn' | 'review';
	due_date?: string | null;
	answerHistory?: card['answerHistory'];
};

export function requireAuth(locals: App.Locals): string {
	if (!locals.user || !locals.accessToken) redirect(303, '/login');
	return locals.accessToken;
}

export async function apiRequest<T>(
	context: ApiContext,
	path: string,
	init: RequestInit = {}
): Promise<T> {
	const headers = new Headers(init.headers);
	headers.set('Authorization', `Bearer ${context.token}`);
	if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

	let response: Response;
	try {
		response = await context.fetch(`${BACKEND_URL}${path}`, { ...init, headers });
	} catch {
		error(502, 'Could not reach the FastAPI backend.');
	}

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
		error(response.status, payload?.detail || 'The backend request failed.');
	}

	if (response.status === 204) return undefined as T;
	return (await response.json()) as T;
}

export function flattenFolders(roots: ApiFolder[]): folder[] {
	const flattened: folder[] = [];
	const visit = (item: ApiFolder, parentid: string | null) => {
		const id = String(item.id);
		flattened.push({
			id,
			name: item.name,
			parentid,
			new: item.new ?? 0,
			learn: item.learn ?? 0,
			due: item.due ?? 0,
			private: !item.public
		});
		for (const child of item.subfolders ?? []) visit(child, id);
	};
	for (const root of roots) visit(root, null);
	return flattened;
}

export async function listFolders(context: ApiContext): Promise<folder[]> {
	const roots = await apiRequest<ApiFolder[]>(context, '/folders');
	return flattenFolders(roots);
}

function cardText(value: ApiCard['question']): string {
	return typeof value === 'string' ? value : (value?.text ?? '');
}

export function mapCard(value: ApiCard, deckid: string): card {
	return {
		id: String(value.id),
		deckid,
		question: cardText(value.question),
		answer: cardText(value.answer),
		type: value.type,
		favourite: value.favourite,
		state: value.state,
		dueDate: value.due_date,
		answerHistory: value.answerHistory ?? []
	};
}

export async function listCards(context: ApiContext, folderId: string): Promise<card[]> {
	const cards = await apiRequest<ApiCard[]>(
		context,
		`/folders/${encodeURIComponent(folderId)}/cards`
	);
	return cards.map((item) => mapCard(item, folderId));
}

export async function listCardsForTree(
	context: ApiContext,
	folders: folder[],
	rootId: string
): Promise<card[]> {
	const descendantIds = new Set<string>([rootId]);
	let foundChild = true;
	while (foundChild) {
		foundChild = false;
		for (const item of folders) {
			if (item.parentid && descendantIds.has(item.parentid) && !descendantIds.has(item.id)) {
				descendantIds.add(item.id);
				foundChild = true;
			}
		}
	}

	const result = await Promise.all([...descendantIds].map((id) => listCards(context, id)));
	const now = Date.now();
	return result.flat().filter((item) => {
		if (item.state === 'new') return true;
		if (item.state !== 'learn' && item.state !== 'review') return false;
		return item.dueDate != null && Date.parse(item.dueDate) <= now;
	});
}
