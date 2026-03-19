import { redirect } from '@sveltejs/kit'

export async function load({ params }) {
  throw redirect(307, `/gegevens/${params.Entity}/details/${params.Slug}/${params.Period}/${params.verslagsoort}/${params.type}/categorie/*`);
}
