import { redirect } from '@sveltejs/kit'
import { apiGet } from '../../../../../utils'

export async function load({ params, data }) {
  const session = data.session
  await apiGet(`/detaildata/${params.Entity}/${params.Slug}`, session.Token)
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