import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const csrfTrustedOrigins = (
	process.env.CSRF_TRUSTED_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000'
)
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			csrf: { trustedOrigins: csrfTrustedOrigins },
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md']
		})
	]
});
