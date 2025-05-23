import { readable } from 'svelte/store';

export const api = readable('', function start(set) {
  set(import.meta.env.VITE_DATA_API ?? 'http://localhost:3000')
	return function stop() {
	};
});

export const loginEnabled = readable('', function start(set) {
  set(import.meta.env.VITE_AUTH_ENABLED)
	return function stop() {
	};
});
