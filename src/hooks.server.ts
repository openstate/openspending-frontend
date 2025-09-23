import { handleSession } from 'svelte-kit-cookie-session';
import { AUTH_CLIENT_SECRET as secret } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { sessionFromEvent } from './utils';
const public_paths = ['/login', '/uitloggen'];
const admin_paths = ['/beheer'];

export function isPathAllowed(path?: string | null) {
  return !isAdminPath(path)
}

const isAdminPath = (path?: string | null) => {
  if (path === null || path === undefined) return false
  return admin_paths.some(adminPath =>
    path === adminPath || path.startsWith(adminPath + '/')
  );
}

export const handle = handleSession({ secret } , ({event, resolve}) => {
  const url = new URL(event.request.url);
  if (isPathAllowed(url.pathname)) return resolve(event);
  if (!sessionFromEvent(event).Token) throw redirect(302, '/login');
  if (isAdminPath(url.pathname) && sessionFromEvent(event).Role !== 'admin')
    throw redirect(302, '/login?noAdmin');
  return resolve(event)
});
