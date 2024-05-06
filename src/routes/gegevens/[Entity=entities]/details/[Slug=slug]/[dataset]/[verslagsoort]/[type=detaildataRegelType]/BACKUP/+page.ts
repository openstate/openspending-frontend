import { error } from '@sveltejs/kit';
import type { BronDetail, DataSet, DetailDataPerCategorie, SourceType } from '../../../../../../../../../Types';

const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: import.meta.env.API ?? 'http://host.docker.internal:3000'

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
  const bron = await fetch(`${api}/bronnen/${params.Entity}/${params.Slug}`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as BronDetail)

  const detaildata = await fetch(`${api}/detaildata/${params.Entity}/${bron.Key}/${params.dataset}/${params.verslagsoort}/${params.type}`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as DetailDataPerCategorie)
  
  let regels = detaildata
  if (params.type !== 'regels') {
    regels = await fetch(`${api}/detaildata/${params.Entity}/${bron.Key}/${params.dataset}/${params.verslagsoort}/regels`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(bron => bron as DetailDataPerCategorie)
  }

  const dataset = await fetch(`${api}/datasets/${params.dataset}`)
    .then(res => {
      if (!res.ok) throw error(404)
      return res.json()
    })
    .then(dataset => dataset as DataSet)
	return {entity, params, bron, detaildata, dataset, regels};
}
