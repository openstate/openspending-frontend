import { readable } from 'svelte/store';

export const api = readable('', function start(set) {
	const url = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://host.docker.internal:3000'
  set(url)
	return function stop() {
	};
});