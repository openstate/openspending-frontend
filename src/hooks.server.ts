import { handleSession } from 'svelte-kit-cookie-session';
import { AUTH_CLIENT_SECRET as secret, VITE_AUTH_ENABLED} from '$env/static/private';
import { redirect } from '@sveltejs/kit';
const public_paths = ['/login', '/uitloggen'];
const admin_paths = ['/beheer'];
export function isPathAllowed(path?: string | null) {
  if (path === null || path === undefined) return false
  return public_paths.some(allowedPath =>
    path === allowedPath || path.startsWith(allowedPath + '/')
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
  if (VITE_AUTH_ENABLED) {
    if (isPathAllowed(url.pathname)) return resolve(event)
    if (!event.locals.session.data.Token) throw redirect(302, '/login');
    if (isAdminPath(url.pathname) && event.locals.session.data.Role !== 'admin')
      throw redirect(302, '/login?noAdmin');
    return resolve(event)
  } else {
    return resolve(event)
  }
});
