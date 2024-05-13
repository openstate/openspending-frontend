import { error, redirect } from '@sveltejs/kit';
import type { SourceType, BronDetail } from '../../../../../../../../../Types';
import { api } from '../../../../../../../../../stores';
import { get } from 'svelte/store';

type DataRow = {
  Code: string | number,
  Titel: string,
  Baten: number,
  Lasten: number,
  rows?: DataRow[]
}

export async function load({ params, fetch}) {
  let entity: SourceType = 'Gemeenten'
  switch (params.Entity) {
    case 'Gemeenten':
    case 'Provincies':
    case 'GemeenschappelijkeRegelingen':
    case 'Waterschappen':
      entity = params.Entity
      break
  }
  const bron = await fetch(`${get(api)}/bronnen/${entity}/${params.Slug}`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)
  const dataset = bron.datasets.filter(dataset => dataset.Identifier === params.dataset).shift()!
  const verslagsoorten = (await fetch(`${get(api)}/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/verslagsoorten`)
    .then(r => r.json())) as string[]

  if (params.verslagsoort === 'onbekend' || !verslagsoorten.includes(params.verslagsoort)) {
    redirect(302, `/gegevens/${entity}/details/${bron.Slug}/${dataset.Identifier}/${verslagsoorten[0]}/kostenplaats/categorie/*`)
  }
  const rows: DataRow[] = (await fetch(`${get(api)}/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/${params.verslagsoort}/per/categorie`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    }))

  const rawFilters = params.filters.split('/')
    .filter(entry => entry.match(/^(categorie|grootboek|kostenplaats)=/))
  
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
    const url = `${get(api)}/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/${params.verslagsoort}/per/categorie/${filters.categorie.join(',')}/${params.type}`
    await fetch(url)
      .then(async res => {
        if (!res.ok) return []
        return await res.json()
      })
      .then(subrows => {
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
        const url = `${get(api)}/detaildata/${entity}/${bron.Key}/${dataset.Identifier}/${params.verslagsoort}/per/categorie/${key}/${params.type}/${idsPerCategory[$key].join(',')}/${params.type === 'grootboek' ? 'kostenplaats' : 'grootboek'}`
        await fetch(url)
          .then(async res => {
            if (!res.ok) return
            const subSubrows = await res.json()
            const row = rows.filter(row => row.Code === $key).shift()
            if (row && row.rows) {
              for (const subSubrow of subSubrows) {
                const id = subSubrow[params.type === 'kostenplaats' ? 'Kostenplaats' : 'Grootboek'].toString()
                const subRow = row.rows.filter(subRow => subRow.Code.toString() === id).shift()
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

  const periodes = await fetch(`${get(api)}/detaildata/${entity}/${bron.Key}`)
    .then(res => res.json() )
    .then(res => (res as Array<{Period: number, Identifier: string}>).sort((a, b) => a.Period>b.Period ? -1 : 1)
      .map(row => {return {Period: row.Period, Identifier: row.Identifier}}))

  return { bron, dataset, params, rows, filters, grootboeken, periodes, verslagsoorten }
}