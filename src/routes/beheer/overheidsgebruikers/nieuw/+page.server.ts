import { get } from 'svelte/store'
import { api } from '../../../../stores.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import type { Bron } from '../../../../Types.js';

export const load: PageServerLoad = async () => {
  const sources: Bron[] = await fetch(`${get(api)}/bronnen/Gemeenten`)
  .then(response => {
    if (!response.ok) throw new Error(`Kan de bronnen niet laden: ${get(api)}/bronnen/Gemeenten ${response.statusText}`)
    return response.json()
  }).catch(e => {
    console.info(`An error occurred when retrieving sources: ${e}`)
    return []
  })

  return {
    sources
  }
}

export const actions = {
	default: async ({ locals, request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    return await fetch(`${get(api)}/admin/overheidsgebruikers`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': locals.session.data.Token
      },
      body: JSON.stringify(data)
    }).then(async (res) => {
      if (!res.ok) {
        const message = `Kon data niet opslaan (API fout ${res.status} ${res.statusText})`
        return fail(400, {success: false, error: message, data})
      }
      const responseParams = JSON.parse(await res.text())
      const invitationLink = getInvitationLink(request, responseParams.key, responseParams.secret)
      return {success: true, message: responseParams.message, invitationLink: invitationLink}
    })
    .catch((e) => {
      return fail(400, {success: false, error: `Er is iets misgegaan:\n${(e as Error).message}`, data})
    })
  }
}

const getInvitationLink = (request: Request, key: string, secret: string): string => {
  const url = new URL(request.url)
  if (!secret) return ''

  return `${url.protocol}//${url.host}/login/registreren?key=${key}&uitnodiging=${secret}`
}