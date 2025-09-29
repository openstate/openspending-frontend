import { redirect } from '@sveltejs/kit'
import { apiUrl } from '../../utils'

export async function load({ fetch, params }) {
  await fetch(`${apiUrl()}/utils/long/${params.key}`)
    .then(async res => {
      if (!res.ok) {
        return redirect(307, `/`)
      } else {
        const data = await res.json()
        return redirect(301, data.url)
      }
    })
}