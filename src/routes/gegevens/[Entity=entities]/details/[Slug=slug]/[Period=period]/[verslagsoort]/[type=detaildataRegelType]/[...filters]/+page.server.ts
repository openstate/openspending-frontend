import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
  return { session: locals.session.data }
}