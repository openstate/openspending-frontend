import { redirect } from '@sveltejs/kit';
export async function load({ params }) {
  throw redirect(307, '/gegevens/Provincies');
}