import { handleSession } from 'svelte-kit-cookie-session';
import { AUTH_CLIENT_SECRET as secret } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { sessionFromEvent } from './utils';
const admin_paths = ['/beheer'];
const source_admin_paths = ['/beheer', '/beheer/publicatie-detaildata'];

export function isPathAllowed(path?: string | null, role?: string | undefined) {
  if (role === 'source' && isSourceAdminPath(path)) return true
  if (role === 'admin' && isAdminPath(path)) return true
  return !isAdminPath(path)
}

const isSourceAdminPath = (path?: string | null) => {
  if (path === null || path === undefined) return false
  return source_admin_paths.some(adminPath =>
    path === adminPath || path === `${adminPath}/__data.json`
  );
}

const isAdminPath = (path?: string | null) => {
  if (path === null || path === undefined) return false
  return admin_paths.some(adminPath =>
    path === adminPath || path.startsWith(adminPath + '/')
  );
}

export const handle = handleSession({ secret } , ({event, resolve}) => {
  const url = new URL(event.request.url);
  const existingSession = sessionFromEvent(event)

  if (isPathAllowed(url.pathname, existingSession.Role)) return resolve(event);
  if (!existingSession.Token) throw redirect(302, '/login');
  if (isAdminPath(url.pathname) && sessionFromEvent(event).Role !== 'admin')
    throw redirect(302, '/login?noAdmin');
  return resolve(event)
});
