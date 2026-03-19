import { error, redirect } from '@sveltejs/kit'
import type { BronDetail } from '../../../../../../Types'
import { apiGet } from '../../../../../../utils'

export async function load({ params, data}) {
  const session = data.session
  const bron = await apiGet(`/bronnen/${params.Entity}/${params.Slug}`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)

  const verslagsoorten = await apiGet(`/detaildata/${params.Entity}/${bron.Slug}/${params.Period}/verslagsoorten`, session.Token)
    .then(res => {
      if (!res.ok) throw error(res.status)
      return res.json()
    })
    .then(verslagsoorten => verslagsoorten as Array<string>)
  if (verslagsoorten.length === 0) {
    throw error(404)
  }
  const verslagsoort = verslagsoorten.pop()!
   throw redirect(307, `/gegevens/${params.Entity}/details/${params.Slug}/${params.Period}/${verslagsoort}/kostenplaats/categorie/*`);
}

