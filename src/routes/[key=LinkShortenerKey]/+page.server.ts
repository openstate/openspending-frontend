import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { api } from '../../stores'

export async function load({ fetch, params }) {
  await fetch(`${get(api)}/utils/long/${params.key}`)
    .then(async res => {
      if (!res.ok) {
        return redirect(307, `/`)
      } else {
        const data = await res.json()
        return redirect(301, data.url)
      }
    })
}