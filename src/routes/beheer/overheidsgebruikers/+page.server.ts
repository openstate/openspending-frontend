import { get } from 'svelte/store'
import { api } from '../../../stores.js';
import type { PageServerLoad } from './$types.js';
import type { User } from '../../../Types.js';

export const load: PageServerLoad = async ({ locals }) => {
  const users: User[] = await fetch(`${get(api)}/admin/overheidsgebruikers`, {
    headers: {
      'authorization': locals.session.data.Token
    }
  })
  .then(response => {
    if (!response.ok) throw new Error(`Kan de gebruikers niet laden: ${get(api)}/admin/overheidsgebruikers ${response.statusText}`)
    return response.json()
  }).catch(e => {
    console.info(`An error occurred when retrieving users: ${e}`)
    return []
  })

  return { users }
}
