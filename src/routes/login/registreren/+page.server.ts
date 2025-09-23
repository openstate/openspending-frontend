import { fail, redirect } from '@sveltejs/kit';
import type { NewUser } from '../../../Types.js';
import type { PageServerLoad } from '../$types.js';
import { apiGet, apiPost } from '../../../utils.js';

export const load: PageServerLoad = async ({ url, locals }) => {
  const key = url.searchParams.get('key')
  const secret = url.searchParams.get('uitnodiging');

  const user: NewUser = await apiGet(`/auth/registreren/ophalen?key=${key}&secret=${secret}`, locals.session.data.Token)
    .then(response => {
      if (!response.ok) throw new Error(`Kan de uitgenodigde gebruiker niet laden: ${response.statusText}`)
      return response.json()
    }).catch(e => {
      console.info(`An error occurred when retrieving sources: ${e}`)
      return undefined
    })
  
  return {
    user
  }
}

export const actions = {
	default: async ({ request, url }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    data['key'] = url.searchParams.get('key') ?? ''
    data['secret'] = url.searchParams.get('uitnodiging') ?? ''
    delete data['confirm_password']

    return await apiPost('/auth/registreren/opslaan', undefined, {
        body: JSON.stringify(data)
    }).then(async res => {
      if (!res.ok) {
        const responseParams = JSON.parse(await res.text())
        let message: string
        if ('error' in responseParams)
          message = responseParams['error']
        else
          message = `Kon data niet opslaan (API fout ${res.status} ${res.statusText})`
        return fail(400, {success: false, error: message, data})
      }
      return {success: true, message: "Registratie geslaagd, u kunt nu inloggen.", showLoginLink: true}
    }).catch(e => {
      console.info(`An error occurred when trying to register: ${e}`)
      return fail(400, {success: false, error: "Er is een onbekend probleem opgetreden", data})
    })
  }
}