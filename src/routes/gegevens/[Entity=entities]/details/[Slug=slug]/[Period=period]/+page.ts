import { error, redirect } from '@sveltejs/kit'
import type { BronDetail, VerslagsoortenResponseType } from '../../../../../../Types'
import { apiPythonGet } from '../../../../../../utils'

export async function load({ params, data}) {
  const session = data.session
  const bron = await apiPythonGet(`/bronnen/${params.Entity}/${params.Slug}`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)

  const verslagsoortenResponse = await apiPythonGet(`/detaildata/${params.Entity}/${bron.Slug}/${params.Period}/verslagsoorten`, session.Token)
    .then(res => {
      if (!res.ok) throw error(res.status)
      return res.json()
    })
    .then(res => res as VerslagsoortenResponseType)
  const verslagsoorten = verslagsoortenResponse['verslagsoorten']
  if (verslagsoorten.length === 0) {
    throw error(404)
  }
  const verslagsoort = verslagsoorten.pop()!
   throw redirect(307, `/gegevens/${params.Entity}/details/${params.Slug}/${params.Period}/${verslagsoort}/kostenplaats/categorie/*`);
}

