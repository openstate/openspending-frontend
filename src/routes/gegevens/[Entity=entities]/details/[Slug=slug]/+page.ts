import { redirect } from '@sveltejs/kit'
import { api } from '../../../../../stores'
import { get } from 'svelte/store'

export async function load({ fetch, params }) {
  await fetch(`${get(api)}/detaildata/${params.Entity}/${params.Slug}`)
    .then(async res => {
      if (!res.ok) {
        return redirect(307, `/gegevens/${params.Entity}/${params.Slug}`)
      } else {
        const data = await res.json()
        if (data.length === 0)
         return redirect(307, `/gegevens/${params.Entity}/${params.Slug}`)
        else
          return redirect(307, `/gegevens/${params.Entity}/details/${params.Slug}/${data[0].Identifier}/kostenplaats`)
      }
    })
  
}