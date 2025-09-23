import { redirect } from '@sveltejs/kit';
import { isPathAllowed } from '../hooks.server';
import type { SessionData } from '../Types';
import { apiPost } from '../utils';

export async function load({ locals, route }) {
  const existingSession = locals.session.data
  if (!isPathAllowed(route.id, existingSession.Role) && !locals.session.data.Token) {
    throw redirect(302, '/login')
  }
  if (!isPathAllowed(route.id, existingSession.Role)) {
    await apiPost('/auth/session', locals.session.data.Token, {
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

	return {
		session: locals.session.data
	};
}