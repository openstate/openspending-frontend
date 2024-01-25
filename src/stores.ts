import { readable } from 'svelte/store';

export const api = readable('', function start(set) {
	const url = window.location.hostname === 'localhost' 
		? 'http://localhost:3000'
		: 'https://data.openspending.nl'
  set(url)
	return function stop() {
	};
});