import type { DataSet, SourceType } from '../../Types';
import { apiGet } from '../../utils';

let error: string = ''
export async function load({ url, data }) {
  const session = data.session
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
      workspaces = await(apiGet(`/zoek/titel?q=${titel}`, session.Token)).then(res => res.json())
    }
    const pgq = encodeURIComponent(booleanOperator === 'raw' ? q : q.split(' ').join(booleanOperator))
    result = await(apiGet(`/zoek?q=${pgq}`, session.Token).then(async res => {
      if (res.ok) {
        error = ''
        return res.json()
      } else {
        error = (await res.json()).message
        return []
      }
    }))

    sources =  await(apiGet(`/zoek/bron?q=${pgq}`, session.Token).then(async res => {
      if (res.ok) {
        return res.json()
      } else {
        return []
      }
    }))

    detaildata =  await(apiGet(`/zoek/detaildata?q=${pgq}`, session.Token).then(async res => {
      if (res.ok) {
        return res.json()
      } else {
        return []
      }
    }))

  }
  
  return { result, detaildata, sources, titel, workspaces: workspaces!, q, error, zoekmethode: url.searchParams.get('zoekmethode')};
}