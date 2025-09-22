import { get } from 'svelte/store';
import { api } from '../../stores.js';
export const actions = {
	default: async ({ locals }) => {
    return await fetch(`${get(api)}/auth/signout`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'authorization': locals.session.data.Token
      }
    })
      .then(async res => {
        if (res.ok) {
      		await locals.session.destroy();
          return {success: true}
        } else {
          try {
            const response = await res.json()
            if (Object.hasOwn(response, 'error')) {
              return {success: false, reason: `${response.error} (code ${res.status})`}
            }
          } catch (_e) {
            return {success: false, reason: `${res.status} ${res.statusText}`}
          }
        }
      }).catch(e => {
        return {success: false, reason: `${(e as Error).message}`}
      })
	}
};