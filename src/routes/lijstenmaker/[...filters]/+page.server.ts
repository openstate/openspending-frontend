import { redirect } from '@sveltejs/kit';

const ignorePaths = [
	'top', 'van', 'bedragen', 'in'
]
export async function load({ params }) {
  const paths = params.filters.split('/').filter(p => !ignorePaths.includes(p))
  if (paths.length === 0) throw redirect(307, `/lijstenmaker`)

  // const filter = {
  //   year: paths.shift() ?? new Date().getFullYear(),
  //   period: paths.shift() ?? 'begroting',
  //   soort: paths.shift() ?? 'baten',
  //   groepering: paths.shift() ?? 'hoofdfunctie'
  // }
	return { ...params, paths };
}
