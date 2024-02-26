import { redirect } from '@sveltejs/kit';
import type { BronDetail } from '../../../../../Types';
const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://localhost:3000'
    
export async function load({ params }) {
  const paths = params.filters.split('/').filter(p => p !== 'per')
  if (paths.length === 0) throw redirect(307, `/gegevens/${params.Entity}/${params.Slug}`)

  const filter = {
    year: paths.shift() ?? new Date().getFullYear(),
    period: paths.shift() ?? 'begroting',
    soort: paths.shift() ?? 'baten',
    groepering: paths.shift() ?? 'hoofdfunctie'
  }
  const open = (paths.shift() ?? '').split('|').filter(code => code)

  const bronnen: BronDetail[] = []
  const slugs = params.Slug.split('|').slice(0, 3)
  const $slugs: string[] = []
  if (slugs.length === 0) {
    throw redirect(307, `/gegevens/${params.Entity}`)
  }

  for (const slug of slugs) {
    const url = `${api}/bronnen/${params.Entity}/${slug}/${filter.year}/${filter.period}/per/${filter.groepering}`
    let Bron: BronDetail
    try {
      Bron = (await fetch(url).then(r => r.json())) as BronDetail
      for (const brondata of Bron.data) {
        if (open.includes(brondata.Code) && brondata.$link) {
          brondata.data = await fetch(brondata.$link).then(res => res.json()).then(d => d.data)
          for (const brondata_l2 of brondata.data ?? []) {
            if (open.includes(brondata_l2.Code) && brondata_l2.$link) {
              brondata_l2.data = await fetch(brondata_l2.$link).then(res => res.json()).then(d => d.data)
            }
          }
        }
      }
      bronnen.push(Bron)
      $slugs.push(Bron.Slug)
    } catch (e) {
      continue
    }
  }

	return { params, filter, bronnen, open, slugs: $slugs };
}
