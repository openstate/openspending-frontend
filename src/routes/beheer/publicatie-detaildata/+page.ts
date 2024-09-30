import { get } from 'svelte/store'
import type { SourceType } from '../../../Types'
import { api } from '../../../stores'

type Bron = {
  Type: SourceType
  Title: string
  Slug: string
  Period: number,
  Workspace: string
  Key: string
}

export async function load({ fetch }) {
  const bronnen: Bron[] = await fetch(`${get(api)}/detaildata/overzicht/niet-gepubliceerd`)
    .then(res => res.json())
  return { bronnen }
}