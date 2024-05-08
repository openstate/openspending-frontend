import { readable } from 'svelte/store';

export const api = readable('', function start(set) {
    const url = import.meta.env.PROD
		? 'https://data.openspending.nl'
		// : 'https://data.openspending.nl'
		: 'http://localhost:3000'
  set(url)
	return function stop() {
	};
});
