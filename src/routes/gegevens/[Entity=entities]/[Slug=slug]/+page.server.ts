import { redirect } from '@sveltejs/kit';
import type { BronMetDatasets } from '../../../../Types';
import { api } from '../../../../stores';
import { get } from 'svelte/store'


export async function load({ params, fetch }) {
	await fetch(`${get(api)}/bronnen/${params.Entity}/${params.Slug}`)
		.then(async res => {
			if (!res.ok) {
				throw redirect(307, '/');
			}
			const Bron = (await res.json() as unknown as BronMetDatasets)
      if (Bron.datasets.length === 0) throw redirect(307, `/gegevens/${params.Entity}`)
			throw redirect(307, `/gegevens/${params.Entity}/per/hoofdfunctie/${params.Slug}/${Bron.datasets[0].Period}/begroting`);
		})
	return { ...params };
}
