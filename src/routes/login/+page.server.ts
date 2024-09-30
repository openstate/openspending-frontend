import { fail, redirect } from '@sveltejs/kit';
import { VITE_AUTH_ENABLED, AUTH_CLIENT_SECRET } from '$env/static/private';
import { get } from 'svelte/store';
import { api } from '../../stores.js';

export async function load() {
  if (!VITE_AUTH_ENABLED) throw redirect(307, '/');
}
import bcrypt from 'bcrypt'
import type { SessionData } from '../../Types.js';

export const actions = {
	default: async ({ request, fetch, locals }) => {
    const formData = await request.formData();
    if (
      !formData.has('username') || !formData.has('wachtwoord')
      || formData.get('username')?.toString().trim() === '' || formData.get('wachtwoord')?.toString().trim() === ''
    ) {
      return fail(401, {success: false, message: 'U heeft geen correcte logingegegevens ingevuld.'})
    }
    const payload = {
      secret: await bcrypt.hash(AUTH_CLIENT_SECRET, 10),
      username: formData.get('username'),
      // password: await bcrypt.hash(formData.get('wachtwoord')!.toString(), 10),
      password: formData.get('wachtwoord')
    }
    return await fetch(`${get(api)}/auth`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      if (!res.ok) {
        let message = `Fout bij het aanroepen van de authenticatie service (${res.status} ${res.statusText}).`
        try {
          const authResponse = await res.json()
          if (typeof authResponse === 'object' && Object.hasOwn(authResponse, 'error'))
            message = authResponse.error
        } catch(e) { /* empty */ }
        return fail(res.status, {success: false, message})
      }
      else {
        const authResponse = (await res.json()) as SessionData
        await locals.session.set(authResponse);
        return {success: true, authResponse }
      }
    })
  }
}
