import { apiPost } from '../../utils.js';
export const actions = {
	default: async ({ locals }) => {
    return await apiPost('/auth/signout', locals.session.data.Token, {})
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