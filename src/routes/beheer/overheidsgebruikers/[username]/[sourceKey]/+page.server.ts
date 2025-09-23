import { get } from 'svelte/store'
import { api } from '../../../../../stores.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import type { User } from '../../../../../Types.js';
import { apiDelete, apiGet } from '../../../../../utils.js';

export const load: PageServerLoad = async ({ locals, params }) => {
  const username = params.username
  const sourceKey = params.sourceKey
  const user: User = await apiGet(`/admin/overheidsgebruikers/${username}`, locals.session.data.Token)
  .then(response => {
    if (!response.ok) throw new Error(`Kan de gebruiker niet laden: ${get(api)}/admin/overheidsgebruiker/${username} ${response.statusText}`)
    return response.json()
  }).catch(e => {
    console.info(`An error occurred when retrieving users: ${e}`)
    return
  })

  const source = user.Sources.filter((source) => source.Key == sourceKey)[0]

  return { user, source }
}

export const actions = {
  default: async ({ locals, params }) => {
    const username = params.username
    const sourceKey = params.sourceKey
    return await apiDelete(`/admin/overheidsgebruikers/${username}/${sourceKey}`, locals.session.data.Token)
    .then(async (res) => {
      if (!res.ok) {
        const message = `Kon gebruiker niet ontkoppelen (API fout ${res.status} ${res.statusText})`
        return fail(400, {success: false, error: message})
      }
      const responseParams = JSON.parse(await res.text())
      return {success: true, message: responseParams.message}
    })
    .catch((e) => {
      return fail(400, {success: false, error: `Er is iets misgegaan:\n${(e as Error).message}`})
    })

  }
}