import { type Bron } from '../../../Types.js';
const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://host.docker.internal:3000'

export async function load({ params, fetch }) {
	const bronnen: Bron[] = await fetch(`${api}/bronnen/${params.Entity}`).then(res => res.json())	
	return { ...params, bronnen };
}
