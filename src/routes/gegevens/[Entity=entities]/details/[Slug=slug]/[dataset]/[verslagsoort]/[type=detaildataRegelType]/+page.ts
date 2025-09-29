import { error, redirect } from '@sveltejs/kit'
import type { BronDetail } from '../../../../../../../../Types'
import { apiGet } from '../../../../../../../../utils'

export async function load({ params, data}) {
  const session = data.session
  const bron = await apiGet(`/bronnen/${params.Entity}/${params.Slug}`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)

  const periodes = await apiGet(`/detaildata/${params.Entity}/${bron.Key}/${params.dataset}/periodes`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(periodes => periodes as Array<{ Verslagsoort: string }>)
    if (periodes.length === 0) {
      throw error(404)
    }
  const periode = periodes.pop()!.Verslagsoort
  throw redirect(307, `/gegevens/${params.Entity}/details/${params.Slug}/${params.dataset}/${periode}/${params.type}/categorie/*`);

}

