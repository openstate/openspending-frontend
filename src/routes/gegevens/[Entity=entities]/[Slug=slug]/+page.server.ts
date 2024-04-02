import { redirect } from '@sveltejs/kit';
import type { BronMetDatasets } from '../../../../Types';

const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://host.docker.internal:3000'

export async function load({ params, fetch }) {
	await fetch(`${api}/bronnen/${params.Entity}/${params.Slug}`)
		.then(async res => {
			if (!res.ok) {
				throw redirect(307, '/');
			}
			const Bron = (await res.json() as unknown as BronMetDatasets)
			throw redirect(307, `/gegevens/${params.Entity}/per/hoofdfunctie/${params.Slug}/${Bron.datasets[0].Period}/begroting`);
		})
	return { ...params };
}
