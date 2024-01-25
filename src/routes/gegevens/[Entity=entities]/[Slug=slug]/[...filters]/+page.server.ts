import { redirect } from '@sveltejs/kit';
export function load({ params }) {
  const filters: Record<string, string> = {}
  const paths = params.filters.split('/')
  if (paths.length % 2 !== 0) {
    throw redirect(307, `/gegevens/${params.Entity}/${params.Slug}`)
  }
  while(paths.length > 0) {
    filters[paths.shift()!] = paths.shift()!
  }
	return { filters };
}
