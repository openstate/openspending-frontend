import { redirect } from '@sveltejs/kit';
import type { SourceWithDatasets } from '../../../../Types';

const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://localhost:3000'

export async function load({ params }) {
	await fetch(`${api}/bronnen/${params.Entity}/${params.Slug}`)
		.then(async res => {
			if (!res.ok) {
				throw redirect(307, '/');
			}
			const Bron = (await res.json() as unknown as SourceWithDatasets)
			const dataset = await (await fetch(Bron.datasets[0].$link)).json()
			const verslagsoort = (Object.keys(dataset.$links).shift())
			throw redirect(307, `/gegevens/${params.Entity}/${params.Slug}/${Bron.datasets[0].Period}/${verslagsoort}/per/categorie`);
		})
	return { ...params };
}
