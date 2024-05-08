import { get } from 'svelte/store'
import { api } from '../../../stores'

export async function load({ fetch }) {
  const bronnen: Array<{Source: string, Slug: string, Jaren: number[], Workspaces: string[]}> = await fetch(`${get(api)}/detaildata/overzicht`)
    .then(res => res.json())
  return { bronnen }
}