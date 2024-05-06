import { redirect } from '@sveltejs/kit'

const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: import.meta.env.API ?? 'http://host.docker.internal:3000'

export async function load({ fetch, params }) {
  await fetch(`${api}/detaildata/${params.Entity}/${params.Slug}`)
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