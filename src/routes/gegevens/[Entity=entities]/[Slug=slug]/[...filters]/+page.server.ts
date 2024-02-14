import { redirect } from '@sveltejs/kit';
import type { BronDetail, SourceWithDatasets } from '../../../../../Types';
const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://localhost:3000'
    
export async function load({ params }) {
  const paths = params.filters.split('/').filter(p => p !== 'per')
  const BronBasis: SourceWithDatasets = await (await fetch(`${api}/bronnen/${params.Entity}/${params.Slug}`)).json()
  if (paths.length === 0) throw redirect(307, `/gegevens/${params.Entity}/${params.Slug}`)

  const filter = {
    year: paths.shift(),
    period: paths.shift() ?? 'begroting',
    soort: paths.shift() ?? 'baten',
    groepering: paths.shift() ?? 'categorie'
  }

  // let url = `${api}/bronnen/${params.Entity}/${params.Slug}/${filter.year}/${filter.period}/${filter.soort}/per/${filter.groepering}`

  const url = `${api}/bronnen/${params.Entity}/${params.Slug}/${filter.year}/${filter.period}/per/${filter.groepering}`
	const Bron = await (await fetch(url)).json() as unknown as BronDetail

	return { params, filter, Bron: {...Bron, datasets: BronBasis.datasets}, url };
}
