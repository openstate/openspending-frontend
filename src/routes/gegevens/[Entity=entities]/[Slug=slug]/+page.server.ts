import { redirect } from '@sveltejs/kit';
import type { BronMetDatasets } from '../../../../Types';
import { apiPythonGet } from '../../../../utils';


export async function load({ params, locals }) {

	await apiPythonGet(`/bronnen/${params.Entity}/${params.Slug}`, locals.session.data.Token)
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
