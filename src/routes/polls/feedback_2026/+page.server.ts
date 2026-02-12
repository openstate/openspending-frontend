import type { PageServerLoad } from './$types.js';
import { CAPJS_SITE_KEY } from '$env/static/private';

export const load: PageServerLoad = async () => {
  return { capjs_site_key: CAPJS_SITE_KEY }
}