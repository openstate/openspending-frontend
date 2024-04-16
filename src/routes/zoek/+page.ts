import type { DataSet, SourceType } from '../../Types';

const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: import.meta.env.API ?? 'http://host.docker.internal:3000'

let error: string = ''
export async function load({ url, fetch }) {
  let booleanOperator = '&'
  const q = url.searchParams.get('q')
  switch(url.searchParams.get('zoekmethode')?.toLowerCase()) {
    case 'of': booleanOperator = ' | '; break;
    case 'en': booleanOperator = ' & '; break;
    case '': booleanOperator = 'raw'; break;
    default: booleanOperator = ' & '; break;
  }
  let result: Array<{
    Title: string,
    Description: string,
    headline_title: string,
    headline_description: string,
    rank: number
  }> = []

  let titel: string = ''
  let workspaces: DataSet[] = []
  let sources: Array<{
    Title: string,
    Slug: string
    Type: SourceType,
    headline: string
  }> = []

  let detaildata: Array<{
    Title: string,
    Slug: string
    Source: string
    Code: string
    Workspace: string
    TitleType: "grootboek" | "kostenplaats",
    Type: SourceType,
    headline: string
    rank: number
  }> = []

  if (q) {
    if (url.searchParams.get('titel')) {
      titel = url.searchParams.get('titel')!
      workspaces = await(fetch(`${api}/zoek/titel?q=${titel}`)).then(res => res.json())
    }
    const pgq = encodeURIComponent(booleanOperator === 'raw' ? q : q.split(' ').join(booleanOperator))
    result = await(fetch(`${api}/zoek?q=${pgq}`).then(async res => {
      if (res.ok) {
        error = ''
        return res.json()
      } else {
        error = (await res.json()).message
        return []
      }
    }))

    sources =  await(fetch(`${api}/zoek/bron?q=${pgq}`).then(async res => {
      if (res.ok) {
        return res.json()
      } else {
        return []
      }
    }))

    detaildata =  await(fetch(`${api}/zoek/detaildata?q=${pgq}`).then(async res => {
      if (res.ok) {
        return res.json()
      } else {
        return []
      }
    }))

  }
  
  return { result, detaildata, sources, titel, workspaces: workspaces!, q, error, zoekmethode: url.searchParams.get('zoekmethode')};
}