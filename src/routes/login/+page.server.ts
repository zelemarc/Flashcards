import { fail, redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Actions } from './$types';

const BACKEND_URL = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const TOKEN_COOKIE = 'access_token';
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

type AuthResponse = {
	access_token?: string;
	detail?: string;
};

async function authenticate(
	request: Request,
	fetch: typeof globalThis.fetch,
	cookies: Cookies,
	endpoint: 'login' | 'register',
	errorField: 'loginError' | 'registerError'
) {
	const formData = await request.formData();
	const email = String(formData.get('email') ?? '').trim();
	const password = String(formData.get('password') ?? '');

	if (!email || !password) {
		return fail(400, { [errorField]: 'Enter your email and password.' });
	}

	if (endpoint === 'register') {
		const repeatPassword = String(formData.get('repeatPassword') ?? '');
		if (password !== repeatPassword) {
			return fail(400, { registerError: 'The passwords do not match.' });
		}

		const validPassword =
			password.length >= 8 &&
			password.length <= 32 &&
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/[0-9]/.test(password) &&
			/[^A-Za-z0-9]/.test(password);

		if (!validPassword) {
			return fail(400, {
				registerError:
					'Use 8–32 characters with uppercase, lowercase, a number, and a special character.'
			});
		}
	}

	let response: Response;
	try {
		response = await fetch(`${BACKEND_URL}/auth/${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
	} catch {
		return fail(503, {
			[errorField]: 'Could not reach the authentication server. Try again shortly.'
		});
	}

	const result = (await response.json().catch(() => ({}))) as AuthResponse;
	if (!response.ok || !result.access_token) {
		const message =
			result.detail ??
			(endpoint === 'login' ? 'Login failed. Check your credentials.' : 'Account creation failed.');
		return fail(response.status >= 400 && response.status < 600 ? response.status : 502, {
			[errorField]: message
		});
	}

	cookies.set(TOKEN_COOKIE, result.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: TOKEN_MAX_AGE_SECONDS
	});

	redirect(303, '/');
}

export const actions: Actions = {
	login: ({ request, fetch, cookies }) =>
		authenticate(request, fetch, cookies, 'login', 'loginError'),
	register: ({ request, fetch, cookies }) =>
		authenticate(request, fetch, cookies, 'register', 'registerError')
};
