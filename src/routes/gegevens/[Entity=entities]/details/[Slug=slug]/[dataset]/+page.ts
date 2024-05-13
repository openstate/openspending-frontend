import { error, redirect } from '@sveltejs/kit'
import type { BronDetail } from '../../../../../../Types'
import { api } from '../../../../../../stores'
import { get } from 'svelte/store'

export async function load({ params, fetch}) {
  const bron = await fetch(`${get(api)}/bronnen/${params.Entity}/${params.Slug}`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)

  const verslagsoorten = await fetch(`${get(api)}/detaildata/${params.Entity}/${bron.Key}/${params.dataset}/verslagsoorten`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(verslagsoorten => verslagsoorten as Array<{ Verslagsoort: string }>)
    if (verslagsoorten.length === 0) {
      throw error(404)
    }
  const periode = verslagsoorten.pop()!.Verslagsoort
   throw redirect(307, `/gegevens/${params.Entity}/details/${params.Slug}/${params.dataset}/${periode}/kostenplaats/categorie/*`);

}

