import { redirect } from '@sveltejs/kit'
import { apiGet } from '../../../../../utils'

type Resultaat = {
  Title: string
  TitleType: string
  Workspace: string
  Code: string
  Slug: string
  Source: string
  Type: string
  headline: string
  rank: number
}

export async function load({ params, data }) {
  const session = data.session
  try {
    const resultaat = JSON.parse(params.filters.replace(/^resultaat\//, '')) as Resultaat
    const url = `/detaildata/redirect-zoekresultaat/Gemeenten/${resultaat.Slug}/${resultaat.Workspace}/${resultaat.TitleType}/${resultaat.Code}`
    const path = await apiGet(url, session.Token)
      .then(async res => {
        if (!res.ok) redirect(302, '/')
        else {
          return await res.text()
        }
      })
    return { path }
  } catch (e) {
    redirect(302, '/')
  }
}