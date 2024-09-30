import { redirect } from '@sveltejs/kit';
import { isPathAllowed } from '../hooks.server';
import { VITE_AUTH_ENABLED } from '$env/static/private';
import { get } from 'svelte/store';
import { api } from '../stores';
import type { SessionData } from '../Types';

export async function load({ locals, route }) {
  if(VITE_AUTH_ENABLED === 'true') {
    if (!isPathAllowed(route.id) && !locals.session.data.Token) {
      throw redirect(302, '/login')
    }
    if (!isPathAllowed(route.id)) {
      await fetch(`${get(api)}/auth/session`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
          'authorization': locals.session.data.Token
        }
      }).then(async res => {
        if (!res.ok) {
          await locals.session.destroy();
          throw redirect(302, '/login?expired');
        }
        return res.json() as Promise<SessionData>
      }) .then(async session => {
        if (!session) {
          await locals.session.destroy();
          throw redirect(302, '/login');          
        }
        locals.session.set(session)
      })
    }
  }

	return {
		session: locals.session.data
	};
}