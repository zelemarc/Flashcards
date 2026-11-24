import type { Handle } from '@sveltejs/kit/hooks';

const TOKEN_COOKIE = 'access_token';
const DEFAULT_BACKEND_URL = 'http://127.0.0.1:8000';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(TOKEN_COOKIE) ?? null;
	event.locals.accessToken = token;
	event.locals.user = null;

	if (token) {
		const backendUrl = (process.env.BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, '');

		try {
			const response = await event.fetch(`${backendUrl}/auth/me`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (response.ok) {
				event.locals.user = (await response.json()) as App.Locals['user'];
			} else if (response.status === 401 || response.status === 403) {
				// Expired or invalid tokens should not keep the browser looking logged in.
				event.cookies.delete(TOKEN_COOKIE, { path: '/' });
				event.locals.accessToken = null;
			}
		} catch {
			// Keep the cookie if the API is temporarily unavailable; public pages can
			// still render, and the token can be checked again on the next request.
		}
	}

	return resolve(event);
};
