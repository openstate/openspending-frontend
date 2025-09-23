import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import type { User } from '../../../../Types.js';
import { apiDelete, apiGet } from '../../../../utils.js';

export const load: PageServerLoad = async ({ locals, params }) => {
  const username = params.username
  const user: User = await apiGet(`/admin/overheidsgebruikers/${username}`, locals.session.data.Token)
  .then(response => {
    if (!response.ok) throw new Error(`Kan de gebruiker niet laden: /admin/overheidsgebruiker/${username} ${response.statusText}`)
    return response.json()
  }).catch(e => {
    console.info(`An error occurred when retrieving users: ${e}`)
    return
  })

  return { user, username }
}

export const actions = {
	default: async ({ locals, params }) => {
    const username = params.username
    return await apiDelete(`/admin/overheidsgebruikers/${username}`, locals.session.data.Token)
    .then(async (res) => {
      if (!res.ok) {
        const message = `Kon gebruiker niet verwijderen (API fout ${res.status} ${res.statusText})`
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