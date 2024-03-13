import { redirect } from '@sveltejs/kit';
import type { BronDetail } from '../../../../../Types';
const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: import.meta.env.API ?? 'http://host.docker.internal:3000'

const verslagsoorten = ['begroting', 'realisatie', 'Q1', 'Q2', 'Q3', 'Q4']
type Verslagsoort = 'begroting' | 'realisatie' | 'Q1' | 'Q2' | 'Q3' | 'Q4'

export async function load({ fetch, params }) {
  const paths = params.filters.split('/').filter(p => p !== 'per')
  if (paths.length === 0) {
    throw redirect(307, `/gegevens/${params.Entity}`)
  }
  const groepering = paths.shift()!

  const ix = paths.findIndex(val => val === 'open')
  let open: string[] = []
  if (ix !== -1) {
    open = paths.splice(ix).slice(1)
    if (!open || open.length === 0 || open[0].split('|').length === 0) {
      throw redirect(307, `/gegevens/${params.Entity}`)
    }
    open = open[0].split('|')
  }
  if (paths.length === 0 || paths.length % 3 !== 0) throw redirect(307, `/gegevens/${params.Entity}`)
  const requested: Array<{ Slug: string, Title: string, Period: number, Verslagsoort: Verslagsoort}> = []

  // eslint-disable-next-line no-constant-condition
  while(true) {
    const Slug = paths.shift()!
    const Period = parseInt(paths.shift()!)
    let Verslagsoort = paths.shift()!
    if (!verslagsoorten.includes(Verslagsoort)) Verslagsoort = 'begroting'
    requested.push({ Title: Slug, Slug, Period, Verslagsoort: Verslagsoort as Verslagsoort })
    if (paths.length === 0) break
  }


  // return {$params, opened }


  const bronnen: BronDetail[] = []

  for (const Slug of Object.values(requested)) {
    const url = `${api}/bronnen/${params.Entity}/${Slug.Slug}/${Slug.Period}/${Slug.Verslagsoort}/per/${groepering === 'categorie' ? groepering : 'hoofdfunctie'}`
    let Bron: BronDetail
    try {
      Bron = (await fetch(url).then(r => r.json())) as BronDetail
      for (const brondata of Bron.data) {
        if (open.includes(brondata.Code) && brondata.$link) {
          brondata.data = await fetch(api + new URL(brondata.$link).pathname).then(res => res.json()).then(d => d.data)
          for (const brondata_l2 of brondata.data ?? []) {
            if (open.includes(brondata_l2.Code) && brondata_l2.$link) {
              brondata_l2.data = await fetch(api + new URL(brondata_l2.$link).pathname).then(res => res.json()).then(d => d.data)
            }
          }
        }
      }
      bronnen.push(Bron)
      Slug.Title = Bron.Title
    } catch (e) {
      continue
    }
  }
	return { params, requested, bronnen, open, groepering };
}
