import type { SourceType } from '../../../Types'
import { apiGet } from '../../../utils'

type Bron = {
  Type: SourceType
  Title: string
  Slug: string
  Period: number,
  Workspace: string
  Key: string
}

export async function load({ data }) {
  const session = data.session
  const bronnen: Bron[] = await apiGet(`/detaildata/overzicht/niet-gepubliceerd`, session.Token)
    .then(res => res.json())
  return { bronnen }
}