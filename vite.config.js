import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
	plugins: [
		sveltekit(),
		svelteTesting()
	],

	test: {
		include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
		environment: 'jsdom'
	},

	server: {
		fs: {
			allow: [
				'static'
			]
		}
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	}
});
