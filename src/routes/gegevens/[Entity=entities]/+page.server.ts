import { type Source } from '../../../Types.js';
const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://localhost:3000'

export async function load({ params }) {
	const bronnen: Source[] = await fetch(`${api}/bronnen/${params.Entity}`).then(res => res.json())	
	return { ...params, bronnen };
}
