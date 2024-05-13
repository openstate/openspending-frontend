import { error, redirect } from '@sveltejs/kit'
import type { BronDetail } from '../../../../../../../../Types'
import { api } from '../../../../../../../../stores'
import { get } from 'svelte/store'

export async function load({ params, fetch}) {
  const bron = await fetch(`${get(api)}/bronnen/${params.Entity}/${params.Slug}`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)

  const periodes = await fetch(`${get(api)}/detaildata/${params.Entity}/${bron.Key}/${params.dataset}/periodes`)
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

