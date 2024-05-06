import { error, redirect } from '@sveltejs/kit'
import type { BronDetail } from '../../../../../../Types'

const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: import.meta.env.API ?? 'http://host.docker.internal:3000'
    
export async function load({ params, fetch}) {
  const bron = await fetch(`${api}/bronnen/${params.Entity}/${params.Slug}`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)

  const periodes = await fetch(`${api}/detaildata/${params.Entity}/${bron.Key}/${params.dataset}/periodes`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(periodes => periodes as Array<{ Verslagsoort: string }>)
    if (periodes.length === 0) {
      throw error(404)
    }
  const periode = periodes.pop()!.Verslagsoort
   throw redirect(307, `/gegevens/${params.Entity}/details/${params.Slug}/${params.dataset}/${periode}/kostenplaats/categorie/*`);

}

