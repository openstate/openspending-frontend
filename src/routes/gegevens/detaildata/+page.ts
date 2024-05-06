const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: import.meta.env.API ?? 'http://host.docker.internal:3000'

export async function load({ fetch }) {
  const bronnen: Array<{Source: string, Slug: string, Jaren: number[], Workspaces: string[]}> = await fetch(`${api}/detaildata/overzicht`)
    .then(res => res.json())
  return { bronnen }
}