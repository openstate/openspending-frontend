import { error, redirect } from '@sveltejs/kit';
import type { SourceType, BronDetail } from '../../../../../../../../../Types';
import { apiGet } from '../../../../../../../../../utils';

export type DataRow = {
  Code: string | number,
  Titel: string,
  Baten: number,
  Lasten: number,
  rows?: DataRow[]
}

export async function load({ params, data}) {
  const session = data.session
  let entity: SourceType = 'Gemeenten'
  switch (params.Entity) {
    case 'Gemeenten':
    case 'Provincies':
    case 'GemeenschappelijkeRegelingen':
    case 'Waterschappen':
      entity = params.Entity
      break
  }
  const bron = await apiGet(`/bronnen/${entity}/${params.Slug}`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)
  const dataset = bron.datasets.filter(dataset => dataset.Identifier === params.dataset).shift()!
  const verslagsoorten = (await apiGet(`/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/verslagsoorten`, session.Token)
    .then(r => r.json())) as string[]

  if (params.verslagsoort === 'onbekend' || !verslagsoorten.includes(params.verslagsoort)) {
    redirect(302, `/gegevens/${entity}/details/${bron.Slug}/${dataset.Identifier}/${verslagsoorten[0]}/kostenplaats/categorie/*`)
  }
  const rows: DataRow[] = (await apiGet(`/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/${params.verslagsoort}/per/categorie`, session.Token)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    }))

  const rawFilters = params.filters.split('/')
    .filter(entry => entry.match(/^(categorie|grootboek|kostenplaats)=/))

  let sortering: {BL: 'Baten' | 'Lasten', volgorde: 'aflopend'|'oplopend'} | undefined
  const re = /.+sorteer\/(Baten|Lasten)\/(aflopend|oplopend).*/
  if (params.filters.match(re)) {
    const [BL, volgorde] = params.filters.replace(re, '$1|$2').split('|')
    sortering = {BL, volgorde} as  {BL: 'Baten' | 'Lasten', volgorde: 'aflopend'|'oplopend'}
  }
  
  const filters: {
    categorie: string[],
    grootboek: string[],
    kostenplaats: string[]
  } = {
    categorie: [],
    grootboek: [],
    kostenplaats: []
  }

  for (const rawFilter of rawFilters) {
    const key = rawFilter.split('=')[0]! as keyof typeof filters
    filters[key] = rawFilter.split('=')[1].trim().split(',').filter(v => v!=='*').map(v => v.trim())
      .filter(v => v !== '')
  }

  const grootboeken: Record<string, DataRow[]> = {

  }
  if ((params.type === 'grootboek' || params.type === 'kostenplaats') && filters.categorie.length > 0) {
    const url = `/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/${params.verslagsoort}/per/categorie/${filters.categorie.join(',')}/${params.type}`
    await apiGet(url, session.Token)
      .then(async res => {
        if (!res.ok) return []
        return await res.json()
      })
      .then(subrows => {
        if (sortering !== undefined ) {
          const zeros = subrows.filter((row: DataRow) => row[sortering.BL] === 0)
          const nonzeros: DataRow[] = (subrows.filter((row: DataRow) => row[sortering.BL] !== 0) as DataRow[])
            .sort((row1, row2) => row1[sortering.BL] > row2[sortering.BL] ? (sortering.volgorde === 'aflopend' ? -1 : 1) : (sortering.volgorde === 'aflopend' ? 1 : -1))
            subrows = [...nonzeros, ...zeros]
        }
        for (const subrow of subrows) {
          const row = rows.filter(row => row.Code === parseInt(subrow.Category)).shift()
          if (row !== undefined) {
            if (!Object.hasOwn(row, 'rows')) row.rows = []
            row.rows!.push(subrow)
          }
        }
      })
    // sub-sub rows:
    const arraykey = params.type as keyof typeof filters
    if (filters[arraykey].length > 0) {
      const idsPerCategory: Record<number, number[]> = {}
      for (const i of filters[arraykey]) {
        const pairs = i.split('|').filter(i => i.match(/^\d+$/)).map(i => parseInt(i)).filter(i => !isNaN(i))
        if (pairs.length === 2){
          const ints = pairs as [number, number]
          if (!Object.hasOwn(idsPerCategory, ints[0])) idsPerCategory[ints[0]] = []
          idsPerCategory[ints[0]].push(ints[1])
        }
      }
      for (const key of Object.keys(idsPerCategory)) {
        const $key = parseInt(key) as keyof typeof idsPerCategory
        const url = `/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/${params.verslagsoort}/per/categorie/${key}/${params.type}/${idsPerCategory[$key].join(',')}/${params.type === 'grootboek' ? 'kostenplaats' : 'grootboek'}`
        await apiGet(url, session.Token)
          .then(async res => {
            if (!res.ok) return
            let subSubrows: DataRow[] = await res.json()
            const row = rows.filter(row => row.Code === $key).shift()
            if (row && row.rows) {
              if (sortering !== undefined ) {
                const zeros = subSubrows.filter((row: DataRow) => row[sortering.BL] === 0)
                const nonzeros: DataRow[] = (subSubrows.filter((row: DataRow) => row[sortering.BL] !== 0) as DataRow[])
                  .sort((row1, row2) => row1[sortering.BL] > row2[sortering.BL] ? (sortering.volgorde === 'aflopend' ? -1 : 1) : (sortering.volgorde === 'aflopend' ? 1 : -1))
                subSubrows = [...nonzeros, ...zeros]
              }
              for (const subSubrow of subSubrows) {
                // @ts-expect-error no typing available
                const id = subSubrow[params.type === 'kostenplaats' ? 'Kostenplaats' : 'Grootboek'].toString()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const subRow = row.rows.filter((subRow: any) => subRow.Code.toString() === id).shift()
                if (subRow !== undefined) {
                  if (!Object.hasOwn(subRow, 'rows')) subRow.rows = []
                  subRow.rows?.push(subSubrow)
                }
              }

            }
          }).catch(e => {
            console.error(e)
          })
      }
    }

  }

  const periodes = await apiGet(`/detaildata/${entity}/${bron.Key}`, session.Token)
    .then(res => res.json() )
    .then(res => (res as Array<{Period: number, Identifier: string}>).sort((a, b) => a.Period>b.Period ? -1 : 1)
      .map(row => {return {Period: row.Period, Identifier: row.Identifier}}))

  return { sortering, bron, dataset, params, rows, filters, grootboeken, periodes, verslagsoorten }
}