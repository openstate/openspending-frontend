import { apiPythonGet } from '../../../utils'

export async function load({ data }) {
  const session = data.session
  const bronnen: Array<{Source: string, Slug: string, SourceType: string, Jaren: number[], Workspaces: string[]}> =
    await apiPythonGet('/detaildata/overzicht', session.Token)
      .then(res => res.json())
  return { bronnen }
}